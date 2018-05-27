import { select, selectAll, mouse } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { MapSetup, defaultMapSetup } from './map.setup';
import { Nuts } from '../../api/geo';
import { cnc } from '../../utils/classname';
const d3 = { select, selectAll, mouse, geoPath };

const style = require('./map.style.scss');

export interface MapAPI {
  createMap: (rootNode: Element, nuts: Nuts) => void;
}

export const CreateMapAPI = (mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  const extent = [[mapSetup.internalPadding, mapSetup.internalPadding],
    [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  let svg = null;
  let zoomGroup = null;
  let tooltip = null;
  let nutSelection = null;

  const createMap = (rootNode: Element, nuts: Nuts) => {
    svg = d3.select(rootNode)
      .append('svg')
        .attr('class', style.svgContainer)
        .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`);

    tooltip = createTooltip(rootNode);

    zoomGroup = svg
      .append('g')
        .attr('class', 'zoom');

    nutSelection = zoomGroup.selectAll('path')
      .data(nuts.featureCollection.features);

    enter(nuts);
  };

  // Enter() Pattern.
  const enter = (nuts: Nuts) => {
    nutSelection.enter()
      .append('path')
        .attr('class', style.nut)
        .attr('d', geoPathGenerator(nuts.featureCollection))
        .attr('fill', 'white')
        .on('mouseenter', showTooltip(tooltip))
        .on('mousemove', updateTooltipPosition(tooltip))
        .on('mouseleave', hideTooltip(tooltip));
  };

  const geoPathGenerator = (featureCollection) =>
    d3.geoPath(mapSetup.projection.fitExtent(extent, featureCollection));

  return {
    createMap,
  };
};


// TODO. To be encapsulated apart.

const createTooltip = (node: Element) => {
  return d3.select(node)
    .append('div')
      .attr('class', cnc(style.tooltip, style.hidden));
};

const showTooltip = (tooltip) => () => {
  tooltip.html(
    `
    <p>TOOLTIP</p>
    `
  );
  updateTooltipPosition(tooltip);
  tooltip.classed(style.hidden, false);
};

const hideTooltip = (tooltip) => () => {
  tooltip.classed(style.hidden, true);
};

const updateTooltipPosition = (tooltip) => () => {
  const mousePosX = d3.mouse(document.body)[0] + 25;
  const mousePosY = d3.mouse(document.body)[1] + 40;
  tooltip
    .style('left', `${mousePosX}px`)
    .style('top', `${mousePosY}px`)
};

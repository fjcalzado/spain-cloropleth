import { select, selectAll, mouse } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { GeometryObject, Feature } from 'geojson';
import { MapSetup, defaultMapSetup } from './map.setup';
import { Nuts } from '../../api/geo';
import { Data } from '../../api/data';
import { cnc } from '../../utils/classname';
const d3 = { select, selectAll, mouse, geoPath };

const style = require('./map.style.scss');

export interface MapAPI {
  createMap: (rootNode: Element, nuts: Nuts, data: Data) => void;
}

interface MergedNutData {
  key: any;
  nut: Feature<GeometryObject, any>;
  datum: any;
}

export const CreateMapAPI = (mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  const extent = [[mapSetup.internalPadding, mapSetup.internalPadding],
    [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  let svg = null;
  let zoomGroup = null;
  let tooltip = null;

  const createMap = (rootNode: Element, nuts: Nuts, data: Data) => {
    svg = d3.select(rootNode)
      .append('svg')
        .attr('class', style.svgContainer)
        .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`);

    tooltip = createTooltip(rootNode);

    zoomGroup = svg
      .append('g')
        .attr('class', 'zoom');

    enter(nuts, data);
  };

  // Enter() Pattern.
  const enter = (nuts: Nuts, data: Data) => {
    const mergedNutsData = mergeNutsAndData(nuts, data);
    const geoPathGenerator = d3.geoPath(mapSetup.projection.fitExtent(extent, nuts.featureCollection));

    zoomGroup.selectAll('path')
      .data(mergedNutsData)
      .enter()
      .append('path')
        .attr('class', style.nut)
        .attr('d', d => geoPathGenerator(d.nut))
        .attr('fill', 'white')
        .on('mouseenter', showTooltip(tooltip, nuts, data))
        .on('mousemove', updateTooltipPosition(tooltip))
        .on('mouseleave', hideTooltip(tooltip));
  };

  return {
    createMap,
  };
};


// TODO. To be encapsulated apart.

const mergeNutsAndData = (nuts: Nuts, data: Data) => {
  const nutArray = nuts.featureCollection.features;
  const dataArray = data.dataCollection;
console.log(dataArray)
  return nutArray.map(nut => {
    const key = nuts.key(nut);
    return {
      key,
      nut,
      datum: dataArray.find(d => data.key(d) === key),
    }
  });
}

const createTooltip = (node: Element) => {
  return d3.select(node)
    .append('div')
      .attr('class', cnc(style.tooltip, style.hidden));
};

const showTooltip = (tooltip, nuts: Nuts, data: Data) => (mergedNutData) => {
  tooltip.html(
    `
    <h4>From NUTS:</h4>
    <p>${nuts.name(mergedNutData.nut)}</p>
    <p>${nuts.key(mergedNutData.nut)}</p>
    <h4>From DATA:</h4>
    <p>${data.name(mergedNutData.datum)}</p>
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

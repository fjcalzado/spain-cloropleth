import { select, selectAll, mouse } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { GeometryObject, Feature } from 'geojson';
import { MapSetup, defaultMapSetup } from './map.setup';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { cnc } from '../../utils/classname';
const d3 = { select, selectAll, mouse, geoPath };

const style = require('./map.style.scss');

export interface MapAPI {
  createMap: (rootNode: Element, nutsApi: NutsAPI, dataApi: DataAPI) => void;
}

interface MergedNutData {
  key: any;
  nut: Feature<GeometryObject, any>;
  data: any;
}

export const CreateMapAPI = (mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  const extent = [[mapSetup.internalPadding, mapSetup.internalPadding],
    [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  let svg = null;
  let zoomGroup = null;
  let tooltip = null;

  const createMap = (rootNode: Element, nutsApi: NutsAPI, dataApi: DataAPI) => {
    svg = d3.select(rootNode)
      .append('svg')
        .attr('class', style.svgContainer)
        .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`);

    if (dataApi.getTooltipContent) {
      tooltip = createTooltip(rootNode);
    }

    zoomGroup = svg
      .append('g')
        .attr('class', 'zoom');

    enter(nutsApi, dataApi);
  };

  // Enter() Pattern.
  const enter = (nutsApi: NutsAPI, dataApi: DataAPI) => {
    const mergedNutsData = mergeNutsAndData(nutsApi, dataApi);
    const geoPathGenerator = d3.geoPath(mapSetup.projection.fitExtent(extent, nutsApi.featureCollection));

    const getGeoPath = (datum: MergedNutData) => geoPathGenerator(datum.nut);
    const getColor = dataApi.getColor ?
      ((datum: MergedNutData) => (dataApi.getColor(datum.data))) : () => 'white';

    zoomGroup.selectAll('path')
      .data(mergedNutsData)
      .enter()
      .append('path')
        .attr('class', style.nut)
        .attr('d', getGeoPath)
        .attr('fill', getColor)
        .on('mouseenter', showTooltip(tooltip, nutsApi, dataApi))
        .on('mousemove', updateTooltipPosition(tooltip))
        .on('mouseleave', hideTooltip(tooltip));
  };

  return {
    createMap,
  };
};


// TODO. To be encapsulated apart.

const mergeNutsAndData = (nutsApi: NutsAPI, dataApi: DataAPI): MergedNutData[] => {
  const nutArray = nutsApi.featureCollection.features;
  const dataArray = dataApi.dataCollection;

  return nutArray.map(nut => {
    const key = nutsApi.key(nut);
    return {
      key,
      nut,
      data: dataArray.find(d => dataApi.getKey(d) === key),
    }
  });
}

const createTooltip = (node: Element) => {
  return d3.select(node)
    .append('div')
      .attr('class', cnc(style.tooltip, style.hidden));
};

const showTooltip = (tooltip, nuts: NutsAPI, data: DataAPI) => (mergedNutData: MergedNutData) => {
  if (tooltip) {
    tooltip.html(data.getTooltipContent(mergedNutData.data));
    updateTooltipPosition(tooltip);
    tooltip.classed(style.hidden, false);
  }
};

const hideTooltip = (tooltip) => () => {
  if (tooltip) tooltip.classed(style.hidden, true);
};

const updateTooltipPosition = (tooltip) => () => {
  if (tooltip) {
    const mousePosX = d3.mouse(document.body)[0] + 25;
    const mousePosY = d3.mouse(document.body)[1] + 40;
    tooltip
      .style('left', `${mousePosX}px`)
      .style('top', `${mousePosY}px`)
  }
};

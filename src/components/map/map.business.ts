import { select, selectAll, mouse, event as d3Event } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { zoom, zoomIdentity } from 'd3-zoom';
import { GeometryObject, Feature } from 'geojson';
import { MapSetup, defaultMapSetup } from './map.setup';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { cnc } from '../../utils/classname';
const d3 = { select, selectAll, mouse, geoPath, zoom, zoomIdentity };

const style = require('./map.style.scss');

export interface MapAPI {
  createMap: (rootNode: Element, nutsApi: NutsAPI, dataApi?: DataAPI) => void;
}

interface MergedNutData {
  key: any;
  nut: Feature<GeometryObject, any>;
  data: any;
}

export const CreateMapAPI = (mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  // Closure Constants
  const paddedExtent = [[mapSetup.internalPadding, mapSetup.internalPadding],
    [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  // Closure Variables
  let root: Element = null;
  let svg = null;
  let background = null;
  let zoomHandler = null;
  let nutGroup = null;
  let tooltip = null;
  let elementZoomed = d3.select(null);
  let geoPathGenerator = null;

  // API Methods - Create Map
  const createMap = (rootNode: Element, nutsApi: NutsAPI, dataApi?: DataAPI) => {
    root = rootNode;
    svg = d3.select(root)
      .append('svg')
        .attr('class', style.svg)
        .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`);
    setSize();
    window.addEventListener('resize', setSize);
    background = svg
      .append('rect')
        .attr('class', style.background)
        .attr('width', mapSetup.width)
        .attr('height', mapSetup.height)
        .on('click', resetZoom);
    nutGroup = svg
      .append('g')
        .attr('class', style.nutGroup)
        .on('mousemove', () => d3Event.preventDefault());
    zoomHandler = getZoomHandler(nutGroup, mapSetup.maxZoomScale, paddedExtent)
    svg.call(zoomHandler);

    if (dataApi && dataApi.getTooltipContent) {
      tooltip = createTooltip(root);
    }

    enter(nutsApi, dataApi);
  };

  const setSize = () => {
    if (root && svg) {
      const rootBbox = root.getBoundingClientRect();
      svg
        .attr('width', rootBbox.width)
        .attr('height', rootBbox.height);
    }
  }

  // API Methods - Enter() Pattern
  const enter = (nutsApi: NutsAPI, dataApi?: DataAPI) => {
    const projection = nutsApi.projection ? nutsApi.projection : mapSetup.defaultProjection;
    geoPathGenerator = d3.geoPath(projection.fitExtent(paddedExtent, nutsApi.featureCollection));

    const mergedNutsData = mergeNutsAndData(nutsApi, dataApi);
    const getGeoPath = (datum: MergedNutData) => geoPathGenerator(datum.nut);
    const getColor = dataApi && dataApi.getColor ?
      ((datum: MergedNutData) => (dataApi.getColor(datum.data))) : mapSetup.defaultFillColor;

    nutGroup.selectAll('path')
      .data(mergedNutsData, (d: MergedNutData) => d ? d.key : this.id)
      .enter()
      .append('path')
        .attr('class', style.nut)
        .attr('d', getGeoPath)
        .attr('fill', getColor)
        .on('mouseenter', showTooltip(tooltip, nutsApi, dataApi))
        .on('mousemove', updateTooltipPosition(tooltip))
        .on('mouseleave', hideTooltip(tooltip))
        .on('click', function(datum) {applyZoom(this, datum)});

    nutGroup.append('path')
      .datum(nutsApi.mesh)
        .attr('class', style.mesh)
        .attr('d', geoPathGenerator);
  };

  const applyZoom = (elementClicked, datum: MergedNutData) => {
    if (elementZoomed.node() === elementClicked) return resetZoom();
    elementZoomed.classed(style.zoomed, false);
    elementZoomed = d3.select(elementClicked).classed(style.zoomed, true);

    const bounds = geoPathGenerator.bounds(datum.nut);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(mapSetup.maxZoomScale,
      mapSetup.clickZoomFitScale / Math.max(dx / mapSetup.width, dy / mapSetup.height)));
    const translate = [mapSetup.width / 2 - scale * x, mapSetup.height / 2 - scale * y];

    svg.transition()
      .duration(750)
      .call(zoomHandler.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
  };

  const resetZoom = () => {
    elementZoomed.classed(style.zoomed, false);
    elementZoomed = d3.select(null);

    svg.transition()
      .duration(750)
      .call(zoomHandler.transform, d3.zoomIdentity);
  };

  return {
    createMap,
  };
};



// TODO. To be encapsulated apart.



const mergeNutsAndData = (nutsApi: NutsAPI, dataApi?: DataAPI): MergedNutData[] => {
  const nutArray = nutsApi.featureCollection.features;
  const dataArray = dataApi ? dataApi.dataCollection : null;

  return nutArray.map(nut => {
    const key = nutsApi.key(nut);
    return {
      key,
      nut,
      data: dataArray && dataArray.find(d => dataApi.getKey(d) === key),
    }
  });
}

const createTooltip = (node: Element) => {
  return d3.select(node)
    .append('div')
      .attr('class', cnc(style.tooltip, style.hidden));
};

const showTooltip = (tooltip, nutsApi: NutsAPI, dataApi: DataAPI) => (mergedNutData: MergedNutData) => {
  if (tooltip && dataApi) {
    tooltip.html(dataApi.getTooltipContent(mergedNutData.data));
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

const getZoomHandler = (element, maxScale, maxExtent) => d3.zoom()
  .extent(maxExtent)
  .scaleExtent([1, maxScale])
  .translateExtent(maxExtent)
  .on('zoom', () => {
    element.attr('transform', d3Event.transform)
  });

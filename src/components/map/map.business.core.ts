import { select, selectAll, event as d3Event } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { MapSetup, defaultMapSetup } from './map.setup';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import {
  addSvgShadowDefinition,
  resetZoomEffect,
  moveToFront,
  applyHighlight,
  resetHighlight,
  applyZoomEffect
} from './map.business.effects';
import { MapAPI, MergedNutData } from './map.business.model';
import { mergeNutsAndData, setSizeFromRoot, getZoomHandler, createTooltip, showTooltip, updateTooltipPosition, hideTooltip } from './map.business.behaviour';
const d3 = { select, selectAll, geoPath, zoom };

const style = require('./map.style.scss');


export const CreateMapAPI = (mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  // Closure Constants
  const paddedExtent = [[mapSetup.internalPadding, mapSetup.internalPadding],
    [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  // Closure Variables
  let root: Element = null;
  let svg = null;
  let defs = null;
  let background = null;
  let zoomHandler = null;
  let zoomGroup = null;
  let nutGroup = null;
  let meshGroup = null;
  let tooltip = null;
  let selectionZoomed = d3.select(null);
  let geoPathGenerator = null;

  // API Methods - Create Map
  const createMap = (rootNode: Element, nutsApi: NutsAPI, dataApi?: DataAPI) => {
    root = rootNode;

    svg = d3.select(root)
      .append('svg')
        .attr('class', style.svg)
        .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`);
    setSizeFromRoot(root, svg);
    window.addEventListener('resize', setSizeFromRoot(root, svg));

    defs = svg.append('defs');
    addSvgShadowDefinition(defs);

    background = svg
      .append('rect')
        .attr('class', style.background)
        .attr('width', mapSetup.width)
        .attr('height', mapSetup.height)
        .on('click', () => { selectionZoomed = resetZoomEffect(zoomHandler, svg) });

    zoomGroup = svg
      .append('g')
        .attr('class', style.zoomGroup)
        .on('mousemove', () => d3Event.preventDefault());
    zoomHandler = getZoomHandler(zoomGroup, mapSetup.maxZoomScale, paddedExtent)
    svg.call(zoomHandler);

    if (dataApi && dataApi.getTooltipContent) {
      tooltip = createTooltip(root);
    }

    enter(nutsApi, dataApi);
  };

  // API Methods - Enter() Pattern
  const enter = (nutsApi: NutsAPI, dataApi?: DataAPI) => {
    const projection = nutsApi.projection ? nutsApi.projection : mapSetup.defaultProjection;
    geoPathGenerator = d3.geoPath(projection.fitExtent(paddedExtent, nutsApi.featureCollection));

    const mergedNutsData = mergeNutsAndData(nutsApi, dataApi);
    const getGeoPath = (datum: MergedNutData) => geoPathGenerator(datum.nut);
    const getColor = dataApi && dataApi.getColor ?
      ((datum: MergedNutData) => (dataApi.getColor(datum.data))) : mapSetup.defaultFillColor;

    nutGroup = zoomGroup.append('g')
        .attr('class', style.nutGroup)
      .selectAll('path')
      .data(mergedNutsData, (datum: MergedNutData) => datum ? datum.key : this.id)
      .enter()
      .append('path')
        .attr('class', style.nut)
        .attr('d', getGeoPath)
        .attr('fill', getColor)
        .on('mouseenter', function(datum: MergedNutData) {
          moveToFront(this);
          applyHighlight(this);
          showTooltip(datum, tooltip, dataApi);
        })
        .on('mousemove', () => updateTooltipPosition(tooltip))
        .on('mouseleave', function(datum: MergedNutData) {
          resetHighlight(this);
          hideTooltip(tooltip);
        })
        .on('click', function(datum: MergedNutData) {
          if (selectionZoomed.node() !== this) {
            selectionZoomed = applyZoomEffect(this, geoPathGenerator.bounds(datum.nut), zoomHandler, svg, mapSetup)
          } else {
            selectionZoomed = resetZoomEffect(zoomHandler, svg);
          }
        });

    meshGroup = zoomGroup.append('g')
        .attr('class', style.meshGroup)
      .append('path')
      .datum(nutsApi.mesh)
        .attr('class', style.mesh)
        .attr('d', geoPathGenerator);
  };

  return {
    createMap,
  };
};

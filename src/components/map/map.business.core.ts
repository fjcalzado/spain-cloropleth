import { select, selectAll, event as d3Event } from 'd3-selection';
import { geoPath, GeoProjection } from 'd3-geo';
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
import { mergeNutsAndData, setSizeFromRoot, getZoomHandler, showTooltip, updateTooltipPosition, hideTooltip } from './map.business.behaviour';
const d3 = { select, selectAll, geoPath, zoom };

const styles = require('./map.scss');

type Extent = [[number, number], [number, number]];

export const CreateMapAPI = ({ svg, tooltip }, mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  // Closure Constants
  const paddedExtent: Extent = [[mapSetup.internalPadding, mapSetup.internalPadding],
  [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  // Closure Variables
  // let svg = null;
  let defs = null;
  let zoomHandler = null;
  let zoomGroup = null;
  // let tooltip = null;
  let selectionZoomed = d3.select(null);
  let geoPathGenerator = null;

  // API Methods - Create Map
  const createMap = (nutsApi: NutsAPI, dataApi?: DataAPI) => {
    // svg = d3Element;
    // root = element;
    // svg = d3.select(element)
    //   .append('svg')
    //     .attr('class', styles.svg)
    //     .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`);
    // setSizeFromRoot(root, svg);
    // window.addEventListener('resize', setSizeFromRoot(root, svg));

    defs = svg.append('defs');
    addSvgShadowDefinition(defs);

    svg
      .append('rect')
      .attr('class', styles.background)
      .attr('width', mapSetup.width)
      .attr('height', mapSetup.height)
      .on('click', () => { selectionZoomed = resetZoomEffect(zoomHandler, svg) });

    zoomGroup = svg
      .append('g')
      .attr('class', styles.zoomGroup)
      .on('mousemove', () => d3Event.preventDefault());
    zoomHandler = getZoomHandler(zoomGroup, mapSetup.maxZoomScale, paddedExtent)
    svg.call(zoomHandler);

    // if (dataApi && dataApi.getTooltipContent) {
    //   tooltip = createTooltip(root);
    // }

    enter(nutsApi, dataApi);
  };

  // API Methods - Enter() Pattern
  const enter = (nutsApi: NutsAPI, dataApi?: DataAPI) => {
    const projection: GeoProjection = nutsApi.projection ? nutsApi.projection : mapSetup.defaultProjection;
    geoPathGenerator = d3.geoPath(projection.fitExtent(paddedExtent, nutsApi.featureCollection));

    const mergedNutsData = mergeNutsAndData(nutsApi, dataApi);
    const getGeoPath = (datum: MergedNutData) => geoPathGenerator(datum.nut);
    const getColor = dataApi && dataApi.getColor ?
      ((datum: MergedNutData) => (dataApi.getColor(datum.data))) : mapSetup.defaultFillColor;

    zoomGroup.append('g')
      .attr('class', styles.nutGroup)
      .selectAll('path')
      .data(mergedNutsData, (datum: MergedNutData) => datum ? datum.key : this.id)
      .enter()
      .append('path')
      .attr('class', styles.nut)
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

    zoomGroup.append('g')
      .attr('class', styles.meshGroup)
      .append('path')
      .datum(nutsApi.mesh)
      .attr('class', styles.mesh)
      .attr('d', geoPathGenerator);
  };

  return {
    createMap,
  };
};

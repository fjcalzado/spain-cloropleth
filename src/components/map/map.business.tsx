import { select, selectAll } from 'd3-selection';
import { geoPath } from 'd3-geo';

import { GeometryObject, FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { MapSetup, defaultMapSetup } from './map.setup';
const d3 = { select, selectAll, geoPath };

const style = require('./map.style.scss');

export interface MapAPI {
  createMap: (rootNode: Element, nutFeatureCollection: FeatureCollection<GeometryObject>) => void;
}

export const CreateMapAPI = (mapSetup: MapSetup = defaultMapSetup): MapAPI => {
  const extent = [[mapSetup.internalPadding, mapSetup.internalPadding],
    [mapSetup.width - mapSetup.internalPadding, mapSetup.height - mapSetup.internalPadding]];

  let svg = null;
  let zoomGroup = null;
  let nutSelection = null;

  const createMap = (rootNode: Element, nutFeatureCollection: FeatureCollection<GeometryObject>) => {
    svg = d3.select(rootNode)
      .append('svg')
        // .attr('width', mapSetup.width)
        // .attr('height', mapSetup.height)
        .attr('viewBox', `0 0 ${mapSetup.width} ${mapSetup.height}`)
        .attr('class', style.svgContainer);

    zoomGroup = svg
      .append('g')
        .attr('class', 'zoom');
    nutSelection = zoomGroup.selectAll('path')
      .data(nutFeatureCollection.features);

    nutSelection.enter()
      .append('path')
        .attr('class', style.nutBoundary)
        .attr('d', geoPathGenerator(nutFeatureCollection));
  };

  const geoPathGenerator = (nutFeatureCollection: FeatureCollection<GeometryObject>) =>
    d3.geoPath(mapSetup.projection.fitExtent(extent, nutFeatureCollection));

  return {
    createMap,
  };
};

import { select, selectAll } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { GeometryObject, FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
const d3 = { select, selectAll, geoPath };

const style = require('./map.style.scss');

export interface MapAPI {
  createMap: (rootNode: Element, nutFeatureCollection: FeatureCollection<GeometryObject>) => void;
}

export const CreateMapAPI = (): MapAPI => {
  const width = 700;  // TODO. Given as input.
  const height = 500; // TODO. Given as input.
  const padding = 20; // TODO. Given as input.
  const extent = [[padding, padding], [width - padding, height - padding]];

  let svg = null;
  let zoomGroup = null;
  let nutSelection = null;

  const createMap = (rootNode: Element, nutFeatureCollection: FeatureCollection<GeometryObject>) => {
    svg = d3.select(rootNode)
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewbox', `0 0 ${width}px ${height}px`)
        .attr('class', style.svgContainer);

    zoomGroup = svg
      .append('g')
        .attr('class', 'zoom');
    nutSelection = zoomGroup.selectAll('path')
      .data(nutFeatureCollection.features);

    // TODO to be moved outside.
    const geoPathGenerator = d3.geoPath(geoConicConformalSpain().fitExtent(extent, nutFeatureCollection));

    nutSelection.enter()
      .append('path')
        .attr('class', style.nutBoundary)
        .attr('d', geoPathGenerator);
  };

  return {
    createMap,
  };
};

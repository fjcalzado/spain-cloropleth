import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';

const classNames = require('./map.style.scss');

export const drawMunicipalities = (geoMunicipalities, path, resultsData, resultsColorScheme, svgContainer) => {
  const municipalies = feature(geoMunicipalities, geoMunicipalities.objects.municipalities as GeometryCollection);
  return svgContainer.selectAll('path').data(municipalies.features)
    .enter()
    .append('path')
    .attr('fill', function(d) {
      const id = d.properties.NATCODE;
      const party = resultsData.get(id);
      return resultsColorScheme.get(party);
    })
    .attr('d', path)
    .attr('class', classNames.municipalityBoundary);
};

export const drawRegionBorder = (geoRegions, path, container) => {
  const regions = feature(geoRegions, geoRegions.objects.communities as GeometryCollection);
  container.selectAll('.region')
    .data(regions.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', classNames.regionBoundary);
};

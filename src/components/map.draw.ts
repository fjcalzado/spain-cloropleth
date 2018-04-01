import * as d3 from 'd3';
import { feature } from 'topojson-client';

const classNames = require('./map.scss');

export const drawMunicipalities = (geoMunicipalities, path, resultsData, resultsColorScheme, svgContainer) => {
  const municipalies = feature(geoMunicipalities, geoMunicipalities.objects.municipalities);
  return svgContainer.selectAll('path').data(municipalies.features)
    .enter()
    .append('path')
    .attr('fill', function (d) {
      const id = d.properties.NATCODE;
      const party = resultsData.get(id);
      return resultsColorScheme.get(party);
    })
    .attr('d', path)
    .attr('class', classNames.municipalityBoundary);
};

export const drawRegionBorder = (geoRegions, path, container) => {
  const regions = feature(geoRegions, geoRegions.objects.ESP_adm1);
  container.selectAll('.region')
    .data(regions.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', classNames.regionBoundary);
};
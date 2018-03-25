import * as d3 from 'd3';
import { feature } from 'topojson-client';

const classNames = require('./map.scss');

export const buildTooltip = (parent) => (
  parent
    .append('div')
    .attr('class', `${classNames.tooltip} ${classNames.hidden}`)
);

export const buildZoom = (parent) => (
  d3.zoom()
    .scaleExtent([1 / 4, 9])
    .on('zoom', zoomTransform(parent))
);

const zoomTransform = (parent) => () => {
  parent.attr('transform', d3.event.transform);
};

export const showTooltip = (tooltip, title, content) => {
  tooltip
    .classed(classNames.hidden, false)
    .attr('style', 'left:' + (d3.event.clientX + 10) + 'px; top:' + (d3.event.clientY - 10) + 'px')
    .html(
      `<div>
          <span> ${title} </span>
          <br />
          <span> ${content} </span>
        </div>`,
  );
};

export const hideTooltip = (tooltip) => {
  tooltip.classed(classNames.hidden, true);
};

export const drawMunicipalities = (geoMunicipalities, path, resultsData, resultsColorScheme, container) => {
  const municipalies = feature(geoMunicipalities, geoMunicipalities.objects.municipalities);
  return container.selectAll('path').data(municipalies.features)
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

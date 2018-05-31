import { select } from 'd3-selection';
import { zoomIdentity } from 'd3-zoom';
const d3 = { select, zoomIdentity };

const style = require('./map.style.scss');


const SVG_SHADOW_ID = "svgshadow";

export const addSvgShadowDefinition = (defs) => {
  const filter = defs.append('filter')
    .attr('id', SVG_SHADOW_ID)
    .attr('filterUnits','userSpaceOnUse');
  filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3);
  filter.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 0);
  filter.append('feComponentTransfer')
    .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.2);
  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}

export const applyZoomEffect = (node, extent, zoomHandler, svg, mapSetup) => {
  const currentSelection = d3.select(node).classed(style.zoomed, true);

  const dx = extent[1][0] - extent[0][0];
  const dy = extent[1][1] - extent[0][1];
  const x = (extent[0][0] + extent[1][0]) / 2;
  const y = (extent[0][1] + extent[1][1]) / 2;
  const scale = Math.max(1, Math.min(mapSetup.maxZoomScale,
    mapSetup.clickZoomFitScale / Math.max(dx / mapSetup.width, dy / mapSetup.height)));
  const translate = [mapSetup.width / 2 - scale * x, mapSetup.height / 2 - scale * y];

  svg.transition()
    .duration(750)
    .call(zoomHandler.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));

  return currentSelection;
};

export const resetZoomEffect = (zoomHandler, svg) => {
  svg.transition()
    .duration(750)
    .call(zoomHandler.transform, d3.zoomIdentity);

  return d3.select(null);
};

export const applyHighlight = (node) => {
  if (!node) return;
  d3.select(node)
    .attr('filter', `url(#${SVG_SHADOW_ID})`)
    .attr('stroke', 'yellow')
    .attr('stroke-width', '0.5px');
}

export const resetHighlight = (node) => {
  if (!node) return;
  d3.select(node)
    .attr('filter', 'none')
    .attr('stroke', 'none');
}

export const moveToFront = (node) => {
  if (!node) return;
  d3.select(node).each(function() {
      this.parentNode.appendChild(this);
  })
}

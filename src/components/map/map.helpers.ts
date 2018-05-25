import * as d3 from 'd3';

const classNames = require('./map.style.scss');

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

import * as d3 from 'd3';

export const buildTooltip = (parent, tooltipStyles, hiddenStyles) => (
  parent
    .append('div')
    .attr('class', `${tooltipStyles} ${hiddenStyles}`)
);

export const showTooltip = (tooltip, title, text, hiddenStyles) => {
  tooltip
    .classed(hiddenStyles, false)
    .attr('style', 'left:' + (d3.event.clientX + 10) + 'px; top:' + (d3.event.clientY - 10) + 'px')
    .html(
      `<div>
          <span> ${title} </span>
          <br />
          <span> ${text} </span>
        </div>`,
  );
};

export const hideTooltip = (tooltip, hiddenStyle) => {
  tooltip.classed(hiddenStyle, true);
};

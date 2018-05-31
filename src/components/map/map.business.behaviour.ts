import { select, mouse, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { cnc } from '../../utils/classname';
import { MergedNutData } from './map.business.model';
const d3 = { select, mouse, zoom};

const style = require('./map.style.scss');


export const mergeNutsAndData = (nutsApi: NutsAPI, dataApi?: DataAPI): MergedNutData[] => {
  const nutArray = nutsApi.featureCollection.features;
  const dataArray = dataApi ? dataApi.dataCollection : null;

  return nutArray.map(nut => {
    const key = nutsApi.key(nut);
    return {
      key,
      nut,
      data: dataArray && dataArray.find(d => dataApi.getKey(d) === key),
    }
  });
}

export const setSizeFromRoot = (root: Element, svg) => () => {
  if (root && svg) {
    const rootBbox = root.getBoundingClientRect();
    svg
      .attr('width', rootBbox.width)
      .attr('height', rootBbox.height);
  }
}

export const createTooltip = (node: Element) => {
  return d3.select(node)
    .append('div')
      .attr('class', cnc(style.tooltip, style.hidden));
};

export const showTooltip = (datum: MergedNutData, tooltip, dataApi: DataAPI) => {
  if (tooltip && dataApi) {
    tooltip.html(dataApi.getTooltipContent(datum.data));
    updateTooltipPosition(tooltip);
    tooltip.classed(style.hidden, false);
  }
};

export const hideTooltip = (tooltip) => {
  if (tooltip) tooltip.classed(style.hidden, true);
};

export const updateTooltipPosition = (tooltip) => {
  if (tooltip) {
    const mousePosX = d3.mouse(document.body)[0] + 25;
    const mousePosY = d3.mouse(document.body)[1] + 40;
    tooltip
      .style('left', `${mousePosX}px`)
      .style('top', `${mousePosY}px`)
  }
};

export const getZoomHandler = (element, maxScale, maxExtent) => d3.zoom()
  .extent(maxExtent)
  .scaleExtent([1, maxScale])
  .translateExtent(maxExtent)
  .on('zoom', () => {
    element.attr('transform', d3Event.transform)
  });

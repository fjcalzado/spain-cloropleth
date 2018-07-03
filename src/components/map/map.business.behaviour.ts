import { select, mouse, event as d3Event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { MergedNutData } from './map.business.model';
const d3 = { select, mouse, zoom };


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

// export const createTooltip = (node: Element) => {
//   return d3.select(node)
//     .append('div')
//       .attr('class', cnc(styles.tooltip, styles.hidden));
// };

export const getZoomHandler = (element, maxScale, maxExtent) => d3.zoom()
  .extent(maxExtent)
  .scaleExtent([1, maxScale])
  .translateExtent(maxExtent)
  .on('zoom', () => {
    element.attr('transform', d3Event.transform)
  });

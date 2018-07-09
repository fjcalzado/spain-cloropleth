import { zoom } from 'd3-zoom';
import { event as d3Event } from 'd3-selection';
export const getZoomHandler = (element, maxScale, maxExtent) => zoom()
  .extent(maxExtent)
  .scaleExtent([1, maxScale])
  .translateExtent(maxExtent)
  .on('zoom', () => {
    element.attr('transform', d3Event.transform)
  });

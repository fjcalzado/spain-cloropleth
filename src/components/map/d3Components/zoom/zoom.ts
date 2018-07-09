import { event as d3Event } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { D3Selection, Extent } from '../types';
const styles = require('./zoom.scss');

interface Props {
  svg: D3Selection<SVGSVGElement>;
  width: number;
  height: number;
  maxZoomScale: number;
  extent: Extent;
}

interface State {
  isZoomed: boolean;
  zoomGroup: D3Selection<any>;
}

const render = (props: Props, state: State) => {
  props.svg
    .append('rect')
    .attr('class', styles.background)
    .attr('width', props.width)
    .attr('height', props.height)
    .on('click', () => {
      resetZoom(props, state);
    });

  const zoomGroup = props.svg
    .append('g')
    // .attr('class', styles.zoomGroup)
    .on('mousemove', () => d3Event.preventDefault());

  state.zoomGroup = zoomGroup;
};

const enter = (props: Props, state: State) => {

}

export const zoomComponent = (props: Props) => {
  const state: State = {
    isZoomed: false,
    zoomGroup: null,
  };
  render(props, state);
  props.svg.call(getZoomHandler(props, state));
}

const getZoomHandler = ({ extent, maxZoomScale }: Props, { zoomGroup }: State) => zoom()
  .extent(extent)
  .scaleExtent([1, maxZoomScale])
  .translateExtent(extent)
  .on('zoom', () => {
    zoomGroup.attr('transform', d3Event.transform)
  });

const resetZoom = (props: Props, state: State) => {
  props.svg.transition()
    .duration(750)
    .call(getZoomHandler(props, state).transform, zoomIdentity);
  state.isZoomed = false;
};

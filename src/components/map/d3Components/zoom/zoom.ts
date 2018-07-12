import { event as d3Event } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { D3Selection, Extent } from '../types';
import { MergedNutData } from '../../map.business.model';
const styles = require('./zoom.scss');

interface Props {
  svg: D3Selection<any>;
  width: number;
  height: number;
  maxZoomScale: number;
  clickZoomFitScale?: number;
  extent: Extent;
  data: MergedNutData[];
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
  state.zoomGroup
    .append('g')
    .selectAll('path')
    .data(props.data, (datum: MergedNutData) => datum ? datum.key : this.id)
    .enter()
    .append('path')
    .attr('class', styles.nut)
    // .attr('d', getGeoPath)
    // .attr('fill', getColor)
    // .on('mouseenter', function(datum: MergedNutData) {
    //   moveToFront(this);
    //   applyHighlight(this);
    //   showTooltip(datum, tooltip, dataApi);
    // })
    // .on('mousemove', () => updateTooltipPosition(tooltip))
    // .on('mouseleave', function(datum: MergedNutData) {
    //   resetHighlight(this);
    //   hideTooltip(tooltip);
    // })
    .on('click', () => {
      state.isZoomed ?
        resetZoom(props, state) :
        applyZoomEffect(props, state);
    });
}

export const zoomComponent = (props: Props) => {
  const state: State = {
    isZoomed: false,
    zoomGroup: null,
  };
  render(props, state);
  props.svg.call(getZoomHandler(props, state));
  enter(props, state);
}

const getZoomHandler = ({ extent, maxZoomScale }: Props, { zoomGroup }: State) => zoom()
  .extent(extent)
  .scaleExtent([1, maxZoomScale])
  .translateExtent(extent)
  .on('zoom', () => {
    zoomGroup.attr('transform', d3Event.transform)
  });

export const applyZoomEffect = (props: Props, state: State) => {
  const dx = props.extent[1][0] - props.extent[0][0];
  const dy = props.extent[1][1] - props.extent[0][1];
  const x = (props.extent[0][0] + props.extent[1][0]) / 2;
  const y = (props.extent[0][1] + props.extent[1][1]) / 2;
  const scale = Math.max(1, Math.min(props.maxZoomScale,
    props.clickZoomFitScale / Math.max(dx / props.width, dy / props.height)));
  const translate = [props.width / 2 - scale * x, props.height / 2 - scale * y];

  props.svg
    .transition()
    .duration(750)
    .call(
      getZoomHandler(props, state).transform,
      zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale),
  );

  state.isZoomed = true;
};

const resetZoom = (props: Props, state: State) => {
  props.svg.transition()
    .duration(750)
    .call(getZoomHandler(props, state).transform, zoomIdentity);
  state.isZoomed = false;
};

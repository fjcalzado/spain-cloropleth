import { event as d3Event } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { D3Selection, Extension } from './types';
import { Area } from '../viewModel';

interface Props {
  svg: D3Selection<any>;
  map: D3Selection<any>;
  areas: Area[];
  mapExtension: Extension;
  getAreaExtension: (area: Area) => Extension;
  maxZoomScale: number;
  clickZoomFitScale: number;
  width: number;
  height: number;
}

interface State {
  currentAreaId: any;
}

export const zoomComponent = (props: Props) => {
  const state: State = {
    currentAreaId: null,
  };
  enter(props, state);
  enableZoomOnSvg(props);
}

const enter = (props: Props, state: State) => {
  props.map
    .selectAll('path')
    .data(props.areas, (area: Area) => area.id)
    .on('click', (area: Area) => {
      state.currentAreaId === area.id ?
        resetZoom(props, state) :
        applyZoom(area, props, state);
    });
};

const enableZoomOnSvg = (props: Props) => {
  props.svg.call(getZoomHandler(props));
};

const getZoomHandler = ({ map, mapExtension, maxZoomScale }: Props) => zoom()
  .extent(mapExtension)
  .scaleExtent([1, maxZoomScale])
  .translateExtent(mapExtension)
  .on('zoom', () => {
    map.attr('transform', d3Event.transform)
  });

export const applyZoom = (area: Area, props: Props, state: State) => {
  const areaExtension = props.getAreaExtension(area);

  const dx = areaExtension[1][0] - areaExtension[0][0];
  const dy = areaExtension[1][1] - areaExtension[0][1];
  const x = (areaExtension[0][0] + areaExtension[1][0]) / 2;
  const y = (areaExtension[0][1] + areaExtension[1][1]) / 2;
  const scale = Math.max(1, Math.min(props.maxZoomScale,
    props.clickZoomFitScale / Math.max(dx / props.width, dy / props.height)));
  const translate = [props.width / 2 - scale * x, props.height / 2 - scale * y];

  props.svg
    .transition()
    .duration(750)
    .call(
      getZoomHandler(props).transform,
      zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale),
  );

  state.currentAreaId = area.id;
};

const resetZoom = (props: Props, state: State) => {
  props.svg.transition()
    .duration(750)
    .call(getZoomHandler(props).transform, zoomIdentity);
  state.currentAreaId = null;
};

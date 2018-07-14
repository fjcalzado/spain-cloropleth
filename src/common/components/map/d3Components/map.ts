import { select, BaseType } from 'd3';
import { geoPath, GeoProjection, GeoPath, GeoPermissibleObjects } from 'd3-geo';
import { GeometryObject, FeatureCollection } from 'geojson';
import { D3Selection, Extension } from '../../../types';
import { GeoArea } from '../viewModel';
import { SVG_SHADOW_ID } from './constants';
import { shadowDefinitions } from './shadowDefinitions';
import { tooltipComponent } from '../../../d3Components/tooltip';
import { zoomComponent } from '../../../d3Components/zoom';
const styles = require('./map.scss');

interface Props {
  root: D3Selection;
  svg: D3Selection;
  geoAreas: GeoArea[];
  geometryObjects: FeatureCollection<GeometryObject, any>;
  projection: GeoProjection;
  width: number;
  height: number;
  padding: number;
  defaultfillColor: string;
  maxZoomScale: number;
  clickZoomFitScale: number;
  highlightColor?: string
}

interface State {
  map: D3Selection;
  mapExtension: Extension;
  geoPathGenerator: GeoPath<any, GeoPermissibleObjects>;
  onShowTooltip: (message: string) => void;
  onHideTooltip: () => void;
  onUpdateTooltipPosition: () => void;
}

export const mapComponent = (props: Props) => {
  const state = createEmptyState();
  shadowDefinitions({
    svg: props.svg,
  });

  state.map = renderMap(props);
  state.mapExtension = calculateMapExtension(props);
  state.geoPathGenerator = getGeoPathGenerator(props, state);

  enter(props, state);

  zoomComponent({
    svg: props.svg,
    node: state.map,
    zoomAreas: props.geoAreas,
    nodeExtension: state.mapExtension,
    nodeSelectionElement: 'path',
    getZoomAreaExension: (geometryObject) => (
      state.geoPathGenerator.bounds(geometryObject)
    ),
    maxZoomScale: props.maxZoomScale,
    clickZoomFitScale: props.clickZoomFitScale,
    width: props.width,
    height: props.height,
  });

  const { onShowTooltip, onHideTooltip, onUpdateTooltipPosition } = tooltipComponent({
    node: props.root,
  });
  state.onShowTooltip = onShowTooltip;
  state.onHideTooltip = onHideTooltip;
  state.onUpdateTooltipPosition = onUpdateTooltipPosition;
};

const createEmptyState = (): State => ({
  map: null,
  mapExtension: null,
  geoPathGenerator: null,
  onShowTooltip: null,
  onHideTooltip: null,
  onUpdateTooltipPosition: null,
});

const renderMap = (props: Props) => props.svg
  .append('g');

const enter = (props: Props, state: State) => {
  state.map
    .selectAll('path')
    .data(props.geoAreas, (geoArea: GeoArea) => geoArea.id)
    .enter()
    .append('path')
    .attr('class', styles.geoArea)
    .attr('d', (geoArea: GeoArea) => state.geoPathGenerator(geoArea.geometryObject))
    .attr('fill', (geoArea: GeoArea) => (
      Boolean(geoArea.color) ?
        geoArea.color :
        props.defaultfillColor
    ))
    .on('mouseenter', function(geoArea: GeoArea) {
      addHighlight(this, props.highlightColor);
      state.onShowTooltip(geoArea.tooltipMessage);
    })
    .on('mousemove', () => state.onUpdateTooltipPosition)
    .on('mouseleave', function() {
      removeHighlight(this);
      state.onHideTooltip();
    });
};

const calculateMapExtension = ({ width, height, padding }: Props): Extension => ([
  [padding, padding],
  [width - padding, height - padding]
]);

const getGeoPathGenerator = (props: Props, state: State) => (
  geoPath(
    props.projection
      .fitExtent(state.mapExtension, props.geometryObjects)
  )
);

const addHighlight = (geoAreaElement: BaseType, highlightColor = 'yellow') => {
  if (geoAreaElement) {
    select(geoAreaElement)
      .attr('filter', `url(#${SVG_SHADOW_ID})`)
      .attr('stroke', highlightColor)
      .attr('stroke-width', '0.5px');
  }
};

const removeHighlight = (geoAreaElement: BaseType) => {
  if (geoAreaElement) {
    select(geoAreaElement)
      .attr('filter', `none`)
      .attr('stroke', 'none');
  }
};

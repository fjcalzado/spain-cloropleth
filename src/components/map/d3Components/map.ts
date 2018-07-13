import { geoPath, GeoProjection, GeoPath, GeoPermissibleObjects } from 'd3-geo';
import { GeometryObject, FeatureCollection } from 'geojson';
import { Extension, D3Selection } from './types';
import { renderShadowDefinitions } from './shadows';
import { zoomComponent } from './zoom/zoom';
import { Area } from '../viewModel';
const styles = require('./map.scss');

interface Props {
  // root: D3Selection<any>; // For tooltip
  svg: D3Selection<any>;
  areas: Area[];
  geometryObjects: FeatureCollection<GeometryObject, any>;
  projection: GeoProjection;
  width: number;
  height: number;
  padding: number;
  defaultfillColor: string;
  maxZoomScale: number;
  clickZoomFitScale: number;
}

interface State {
  map: D3Selection<any>;
  mapExtension: Extension;
  geoPathGenerator: GeoPath<any, GeoPermissibleObjects>;
}

export const mapComponent = (props: Props) => {
  const state: State = {
    map: null,
    mapExtension: null,
    geoPathGenerator: null,
  };
  renderShadowDefinitions(props.svg);

  state.map = renderMap(props);
  state.mapExtension = calculateMapExtension(props);
  state.geoPathGenerator = getGeoPathGenerator(props, state);

  enter(props, state);

  zoomComponent({
    svg: props.svg,
    map: state.map,
    areas: props.areas,
    mapExtension: state.mapExtension,
    getAreaExtension: (area: Area) => (
      state.geoPathGenerator.bounds(area.geometryObject)
    ),
    maxZoomScale: props.maxZoomScale,
    clickZoomFitScale: props.clickZoomFitScale,
    width: props.width,
    height: props.height,
  });
}

const renderMap = (props: Props) => props.svg
  .append('g');

const enter = (props: Props, state: State) => {
  state.map
    .selectAll('path')
    .data(props.areas, (area: Area) => area.id)
    .enter()
    .append('path')
    .attr('class', styles.area)
    .attr('d', (area: Area) => state.geoPathGenerator(area.geometryObject))
    .attr('fill', (area: Area) => (
      Boolean(area.color) ?
        area.color :
        props.defaultfillColor
    ));
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
}

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

import * as React from 'react';
import { select } from 'd3-selection';
import { GeoProjection, geoMercator } from 'd3-geo';
import { FeatureCollection, GeometryObject } from 'geojson';
import { mapComponent } from './d3Components';
import { GeoArea } from './viewModel';
import { cnc } from '../../helpers/classname';
const styles = require('./map.scss');

export interface Props {
  geoAreas: GeoArea[];
  geoEntities: FeatureCollection<GeometryObject, any>;
  projection?: GeoProjection;
  width?: number;
  height?: number;
  padding?: number;
  defaultfillColor?: string;
  maxZoomScale?: number;
  clickZoomFitScale?: number;
  className?: string;
}

export class MapComponent extends React.PureComponent<Props, {}> {
  private nodes = {
    root: React.createRef<HTMLDivElement>(),
    svg: React.createRef<SVGSVGElement>(),
  };

  static defaultProps: Partial<Props> = {
    width: 700,
    height: 500,
    padding: 20,
    projection: geoMercator(),
    defaultfillColor: 'lightgrey',
    maxZoomScale: 30,
    clickZoomFitScale: 0.65,
  };

  public componentDidMount() {
    if (this.areThereGeoAreas(this.props)) {
      this.renderD3MapComponent(this.props);
    }
  }

  componentDidUpdate() {
    this.renderD3MapComponent(this.props);
  }

  private areThereGeoAreas = (props: Props) => (
    Array.isArray(props.geoAreas) &&
    props.geoAreas.length > 0
  );

  private renderD3MapComponent = (props: Props) => {
    mapComponent({
      root: select(this.nodes.root.current),
      svg: select(this.nodes.svg.current),
      geoAreas: props.geoAreas,
      geoEntities: props.geoEntities,
      projection: props.projection,
      width: props.width,
      height: props.height,
      padding: props.padding,
      defaultfillColor: props.defaultfillColor,
      maxZoomScale: props.maxZoomScale,
      clickZoomFitScale: props.clickZoomFitScale,
    });
  }

  public render() {
    return (
      <div
        className={`${cnc(styles.container, this.props.className)}`}
        ref={this.nodes.root}
      >
        <svg
          ref={this.nodes.svg}
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        >
        </svg>
      </div>
    );
  }
}

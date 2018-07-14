import * as React from 'react';
import { select } from 'd3-selection';
import { GeoProjection, geoMercator } from 'd3-geo';
import { FeatureCollection, GeometryObject } from 'geojson';
import { mapComponent } from './d3Components';
import { Area } from './viewModel';
const styles = require('./map.scss');

export interface Props {
  areas: Area[];
  geometryObjects: FeatureCollection<GeometryObject, any>;
  projection?: GeoProjection;
  width?: number;
  height?: number;
  padding?: number;
  defaultfillColor?: string;
  maxZoomScale?: number;
  clickZoomFitScale?: number;
}

export class MapComponent extends React.Component<Props, {}> {
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
    mapComponent({
      root: select(this.nodes.root.current),
      svg: select(this.nodes.svg.current),
      areas: this.props.areas,
      geometryObjects: this.props.geometryObjects,
      projection: this.props.projection,
      width: this.props.width,
      height: this.props.height,
      padding: this.props.padding,
      defaultfillColor: this.props.defaultfillColor,
      maxZoomScale: this.props.maxZoomScale,
      clickZoomFitScale: this.props.clickZoomFitScale,
    })
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div className={styles.container} ref={this.nodes.root}>
        <svg
          ref={this.nodes.svg}
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        >
        </svg>
      </div>
    );
  }
}

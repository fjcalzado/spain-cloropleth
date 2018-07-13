import * as React from 'react';
import { select } from 'd3-selection';
import { GeoProjection, geoMercator } from 'd3-geo';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { mapComponent } from './d3Components/map';
import { mapAreaListModelToVM } from './mapper';
const styles = require('./map.scss');

export interface Props {
  nuts: NutsAPI;
  data?: DataAPI;
  width?: number;
  height?: number;
  padding?: number;
  projection?: GeoProjection;
  defaultfillColor?: string;
  maxZoomScale?: number;
  clickZoomFitScale?: number;
}

export class MapComponent extends React.Component<Props, {}> {
  private nodes = {
    root: null,
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

  setRootNode = (node) => {
    this.nodes.root = node;
  }

  public componentDidMount() {
    mapComponent({
      // root: select(this.nodes.root),
      svg: select(this.nodes.svg.current),
      areas: mapAreaListModelToVM(this.props.nuts, this.props.data),
      geometryObjects: this.props.nuts.featureCollection,
      projection: this.props.nuts.projection,
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
      <div className={styles.container} ref={this.setRootNode}>
        <svg
          ref={this.nodes.svg}
          className={styles.svg}
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        >
        </svg>
      </div>
    );
  }
}

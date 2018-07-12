import * as React from 'react';
import { select } from 'd3-selection';
import { GeoProjection, geoMercator } from 'd3-geo';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { renderMap } from './d3Components/map';
const styles = require('./map.scss');

export interface Props {
  nuts: NutsAPI;
  data?: DataAPI;
  width?: number;
  height?: number;
  internalPadding?: number;
  defaultProjection?: GeoProjection;
  fillColor?: string;
  maxZoomScale?: number;
  clickZoomFitScale?: number;
}

export class MapComponent extends React.Component<Props, {}> {
  private nodes = {
    root: null,
    svg: null,
  };

  static defaultProps: Partial<Props> = {
    width: 700,
    height: 500,
    internalPadding: 20,
    defaultProjection: geoMercator(),
    fillColor: 'lightgrey',
    maxZoomScale: 30,
    clickZoomFitScale: 0.65,
  };

  setRootNode = (node) => {
    this.nodes.root = node;
  }

  setSvgNode = (node) => {
    this.nodes.svg = node;
  }

  public componentDidMount() {
    renderMap({
      root: select(this.nodes.root),
      svg: select(this.nodes.svg),
      nuts: this.props.nuts,
      data: this.props.data,
      width: this.props.width,
      height: this.props.height,
      internalPadding: this.props.internalPadding,
      defaultProjection: this.props.defaultProjection,
      fillColor: this.props.fillColor,
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
          ref={this.setSvgNode}
          className={styles.svg}
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        >
        </svg>
      </div>
    );
  }
}

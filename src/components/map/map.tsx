import * as React from 'react';
import { select } from 'd3-selection';
import { GeoProjection, geoMercator } from 'd3-geo';
import { CreateMapAPI } from './map.business.core';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { TooltipComponent } from './components';
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

interface State {
  // mapApi: MapAPI;
}

export class MapComponent extends React.Component<Props, State> {
  private nodes = {
    root: React.createRef<HTMLDivElement>(),
    svg: React.createRef<SVGSVGElement>(),
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

  public componentDidMount() {
    CreateMapAPI(this.nodes).createMap(this.props.nuts, this.props.data);
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div className={styles.container} ref={this.nodes.root}>
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

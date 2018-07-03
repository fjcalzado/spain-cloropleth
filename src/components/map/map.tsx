import * as React from 'react';
import { select } from 'd3-selection';
import { CreateMapAPI } from './map.business.core';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { cnc } from '../../utils/classname';
const styles = require('./map.scss');

export interface Props {
  nuts: NutsAPI;
  data?: DataAPI;
  width?: number;
  height?: number;
}

interface State {
  // mapApi: MapAPI;
}

export class MapComponent extends React.Component<Props, State> {
  private d3Nodes = {
    root: null,
    svg: null,
    tooltip: null,
  };

  static defaultProps: Partial<Props> = {
    width: 700,
    height: 500,
  };

  public componentDidMount() {
    CreateMapAPI(this.d3Nodes).createMap(this.props.nuts, this.props.data);
  }

  private setD3Node = (d3Node) => (node) => {
    this.d3Nodes = {
      ...this.d3Nodes,
      [d3Node]: select(node),
    };
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div className={styles.container} ref={this.setD3Node('root')}>
        <svg
          ref={this.setD3Node('svg')}
          className={styles.svg}
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
        >
        </svg>
        <div
          ref={this.setD3Node('tooltip')}
          className={cnc(styles.tooltip, styles.hidden)}
        >
        </div>
      </div>
    );
  }
}

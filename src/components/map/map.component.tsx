import * as React from 'react';
import { CreateMapAPI, MapAPI } from './map.business';
import { GeometryObject, FeatureCollection } from 'geojson';
import { Nuts } from '../../api/geo';

const style = require('./map.style.scss');

export interface MapProps {
  nuts: Nuts;
  data?: any[];
}

interface MapState {
  mapApi: MapAPI;
}

export class MapComponent extends React.Component<MapProps, MapState> {
  constructor(props) {
    super(props);

    this.state = {
      mapApi: CreateMapAPI(),
    };
  }

  private containerRef = null;

  private setRef = (ref) => {
    this.containerRef = ref;
  }

  public componentDidMount() {
    this.state.mapApi.createMap(this.containerRef, this.props.nuts);
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (
      <div className={style.container} ref={this.setRef}/>
    );
  }
}

import * as React from 'react';
import { CreateMapAPI, MapAPI } from './map.business';
import { GeometryObject, FeatureCollection } from 'geojson';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';

const style = require('./map.style.scss');

export interface MapProps {
  nuts: NutsAPI;
  data: DataAPI;
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
    this.state.mapApi.createMap(this.containerRef, this.props.nuts, this.props.data);
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

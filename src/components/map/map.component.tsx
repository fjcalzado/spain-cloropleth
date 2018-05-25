import * as React from 'react';
import { CreateMapAPI, MapAPI } from './map.business';
import { GeometryObject, FeatureCollection } from 'geojson';

const style = require('./map.style.scss');

export interface MapProps {
  nutFeatures: FeatureCollection<GeometryObject>;
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
    this.state.mapApi.createMap(this.containerRef, this.props.nutFeatures);
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

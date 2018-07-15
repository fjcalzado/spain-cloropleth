import * as React from 'react';
import { FeatureCollection, GeometryObject, MultiLineString } from 'geojson';
import { LifeExpectancyEntity } from './viewModel';
import { lifeExpectancyAPI } from '../../rest-api/api/lifeExpectancy';
import { getGeoEntities, geoAreaTypes, getMesh } from '../../common/geo/spain';
import { LifeExpectancyMapComponent } from './lifeExpectancyMap';
import { mapLifeExpectancyEntitiesModelToVM } from './mapper';

interface State {
  lifeExpectancyEntities: LifeExpectancyEntity[];
  geoEntities: FeatureCollection<GeometryObject, any>;
  mesh: MultiLineString;
}

export class LifeExpectancyMapContainer extends React.PureComponent<{}, State> {
  state = {
    lifeExpectancyEntities: [],
    geoEntities: null,
    mesh: null,
  };

  componentDidMount() {
    lifeExpectancyAPI.fetchLifeExpectancyEntities()
      .then((lifeExpectancyEntities) => {
        this.setState({
          lifeExpectancyEntities: mapLifeExpectancyEntitiesModelToVM(lifeExpectancyEntities),
          geoEntities: getGeoEntities(geoAreaTypes.provinces),
          mesh: getMesh(geoAreaTypes.provinces),
        })
      });
  }

  render() {
    return (
      <LifeExpectancyMapComponent
        lifeExpectancyEntities={this.state.lifeExpectancyEntities}
        geoEntities={this.state.geoEntities}
        mesh={this.state.mesh}
      />
    );
  }
}

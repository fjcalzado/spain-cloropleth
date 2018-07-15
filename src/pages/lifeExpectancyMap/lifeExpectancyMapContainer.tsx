import * as React from 'react';
import { FeatureCollection, GeometryObject } from 'geojson';
import { LifeExpectancyEntity } from './viewModel';
import { lifeExpectancyAPI } from '../../rest-api/api/lifeExpectancy';
import { getGeoEntities, geoAreaTypes } from '../../common/geo/spain';
import { LifeExpectancyMapComponent } from './lifeExpectancyMap';
import { mapLifeExpectancyEntitiesModelToVM } from './mapper';

interface State {
  lifeExpectancyEntities: LifeExpectancyEntity[];
  geoEntities: FeatureCollection<GeometryObject, any>;
}

export class LifeExpectancyMapContainer extends React.PureComponent<{}, State> {
  state = {
    lifeExpectancyEntities: [],
    geoEntities: null,
  };

  componentDidMount() {
    lifeExpectancyAPI.fetchLifeExpectancy()
      .then((lifeExpectancyEntities) => {
        this.setState({
          lifeExpectancyEntities: mapLifeExpectancyEntitiesModelToVM(lifeExpectancyEntities),
          geoEntities: getGeoEntities(geoAreaTypes.provinces)
        })
      });
  }

  render() {
    return (
      <LifeExpectancyMapComponent
        lifeExpectancyEntities={this.state.lifeExpectancyEntities}
        geoEntities={this.state.geoEntities}
      />
    );
  }
}

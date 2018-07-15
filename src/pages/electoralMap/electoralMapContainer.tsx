import * as React from 'react';
import { FeatureCollection, GeometryObject, MultiLineString } from 'geojson';
import { ElectoralVoteEntity } from './viewModel';
import { electoralVoteAPI } from '../../rest-api/api/electoralVote';
import { getGeoEntities, geoAreaTypes, getMesh } from '../../common/geo/spain';
import { ElectoralMapComponent } from './electoralMap';
import { mapElectoralVoteEntitiesModelToVM } from './mapper';

interface State {
  electoralVoteEntities: ElectoralVoteEntity[];
  geoEntities: FeatureCollection<GeometryObject, any>;
  mesh: MultiLineString;
}

export class ElectoralMapContainer extends React.PureComponent<{}, State> {
  state = {
    electoralVoteEntities: [],
    geoEntities: null,
    mesh: null,
  };

  componentDidMount() {
    electoralVoteAPI.fetchElectoralVoteEntities()
      .then((electoralVoteEntities) => {
        this.setState({
          electoralVoteEntities: mapElectoralVoteEntitiesModelToVM(electoralVoteEntities),
          geoEntities: getGeoEntities(geoAreaTypes.municipalities),
          mesh: getMesh(geoAreaTypes.municipalities),
        })
      });
  }

  render() {
    return (
      <ElectoralMapComponent
        electoralVoteEntities={this.state.electoralVoteEntities}
        geoEntities={this.state.geoEntities}
        mesh={this.state.mesh}
      />
    );
  }
}
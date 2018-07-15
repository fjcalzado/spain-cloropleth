import * as React from 'react';
import { MapComponent } from '../../common/components/map';
import { getElectionData } from '../../api/data';
import { mapGeoAreaListModelToVM } from './mapper';
import { getProjection, getGeoEntities, geoAreaTypes } from '../../common/geo/spain';
const styles = require('./electoralMap.scss');

export const ElectoralMapComponent: React.StatelessComponent = (props) => (
  <div className={styles.electoralMap}>
    <h1 className={styles.header}>Electoral map</h1>
    <div className={styles.mapContainer}>
      <MapComponent
        geoAreas={mapGeoAreaListModelToVM(getElectionData())}
        geoEntities={getGeoEntities(geoAreaTypes.municipalities)}
        projection={getProjection()}
      />
    </div>
  </div>
);


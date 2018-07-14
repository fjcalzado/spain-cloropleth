import * as React from 'react';
import { MapComponent } from '../../common/components/map';
import { getNuts } from '../../api/geo';
import { getElectionData } from '../../api/data';
import { spainLevel4 } from '../../api/geo/nuts.spain';
import { mapGeoAreaListModelToVM } from './mapper';
const styles = require('./electoralMap.scss');

export const ElectoralMapComponent: React.StatelessComponent = (props) => (
  <div className={styles.electoralMap}>
    <h1 className={styles.header}>Electoral map</h1>
    <div className={styles.mapContainer}>
      <MapComponent
        geoAreas={mapGeoAreaListModelToVM(getNuts(spainLevel4), getElectionData())}
        geometryObjects={getNuts(spainLevel4).featureCollection}
        projection={getNuts(spainLevel4).projection}
      />
    </div>
  </div>
);


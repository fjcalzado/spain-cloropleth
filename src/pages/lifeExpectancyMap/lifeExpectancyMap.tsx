import * as React from 'react';
import { MapComponent } from '../../common/components/map';
import { getNuts } from '../../api/geo';
import { getElectionData, getLifeExpectancyData } from '../../api/data';
import { spainLevel2, spainLevel3, spainLevel4 } from '../../api/geo/nuts.spain';
import { mapGeoAreaListModelToVM } from './mapper';
const styles = require('./lifeExpectancyMap.scss');

export const LifeExpectancyMapComponent: React.StatelessComponent = (props) => (
  <div className={styles.lifeExpectancyMap}>
    <h1 className={styles.header}>Life expectancy map</h1>
    <div className={styles.mapContainer}>
      <MapComponent
        geoAreas={mapGeoAreaListModelToVM(getNuts(spainLevel3), getLifeExpectancyData())}
        geometryObjects={getNuts(spainLevel3).featureCollection}
        projection={getNuts(spainLevel3).projection}
      />
    </div>
  </div>
);


import * as React from 'react';
import { MapComponent } from '../../common/components/map';
import { getElectionData, getLifeExpectancyData } from '../../api/data';
import { mapGeoAreaListModelToVM } from './mapper';
import { getProjection, getGeoEntities, geoAreaTypes } from '../../common/geo/spain';
const styles = require('./lifeExpectancyMap.scss');

export const LifeExpectancyMapComponent: React.StatelessComponent = (props) => {
  const geoEntities = getGeoEntities(geoAreaTypes.provinces);

  return (
    <div className={styles.lifeExpectancyMap}>
      <h1 className={styles.header}>Life expectancy map</h1>
      <div className={styles.mapContainer}>
        <MapComponent
          geoAreas={mapGeoAreaListModelToVM(geoEntities, getLifeExpectancyData())}
          geoEntities={geoEntities}
          projection={getProjection()}
        />
      </div>
    </div>
  );
};


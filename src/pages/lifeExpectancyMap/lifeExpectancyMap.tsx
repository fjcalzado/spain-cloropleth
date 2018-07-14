import * as React from 'react';
import { Link } from 'react-router';
import { MapComponent } from '../../common/components/map';
import { getNuts } from '../../api/geo';
import { getElectionData, getLifeExpectancyData } from '../../api/data';
import { spainLevel2, spainLevel3, spainLevel4 } from '../../api/geo/nuts.spain';
import { mapGeoAreaListModelToVM } from './mapper';
const style = require('./lifeExpectancyMap.scss');

export const LifeExpectancyMapComponent: React.StatelessComponent = (props) => (
  <div className={style.displayMapContainer}>
    <h1 className={style.header}>Map Component</h1>
    <div className={style.cardContainer}>
      <MapComponent
        geoAreas={mapGeoAreaListModelToVM(getNuts(spainLevel3), getLifeExpectancyData())}
        geometryObjects={getNuts(spainLevel3).featureCollection}
        projection={getNuts(spainLevel3).projection}
      />
    </div>
  </div>
);


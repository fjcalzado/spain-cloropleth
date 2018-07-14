import * as React from 'react';
import { Link } from 'react-router';
import { MapComponent } from '../../common/components/map';
import { getNuts } from '../../api/geo';
import { getElectionData, getLifeExpectancyData } from '../../api/data';
import { spainLevel2, spainLevel3, spainLevel4 } from '../../api/geo/nuts.spain';
import { mapAreaListModelToVM } from './mapper';

const style = require('./display-map.style.scss');

export const DisplayMapComponent: React.StatelessComponent = (props) => (
  <div className={style.displayMapContainer}>
    <h1 className={style.header}>Map Component</h1>
    <div className={style.cardContainer}>
      <MapComponent
        areas={mapAreaListModelToVM(getNuts(spainLevel3), getLifeExpectancyData())}
        geometryObjects={getNuts(spainLevel3).featureCollection}
        projection={getNuts(spainLevel3).projection}
      />
    </div>
  </div>
);


import * as React from 'react';
import { Link } from 'react-router';
import { ElectionsMap } from '../../components/map/map';
import { MapComponent } from '../../components/map';
import { getNutFeatures } from '../../api/geo';

const style = require('./display-map.style.scss');

export const DisplayMapComponent: React.StatelessComponent = (props) => (
  <div className={style.displayMapContainer}>
    <h1 className={style.header}>Spain Elections</h1>
    {/* <ElectionsMap
      height={'500px'}
      width={'100%'}
    /> */}
    <div className={style.cardContainer}>
      <MapComponent
        nutFeatures={getNutFeatures(3)}
        data={null}
      />
    </div>
  </div>
);

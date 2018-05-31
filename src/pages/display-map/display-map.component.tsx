import * as React from 'react';
import { Link } from 'react-router';
import { MapComponent } from '../../components/map';
import { getNuts } from '../../api/geo';
import { getElectionData } from '../../api/data';
import { spainLevel2, spainLevel3, spainLevel4 } from '../../api/geo/nuts.spain';

const style = require('./display-map.style.scss');

export const DisplayMapComponent: React.StatelessComponent = (props) => (
  <div className={style.displayMapContainer}>
    <h1 className={style.header}>Spain Elections</h1>
    <div className={style.cardContainer}>
      <MapComponent
        nuts={getNuts(spainLevel2)}
        data={getElectionData()}
      />
    </div>
  </div>
);


import * as React from 'react';
import { Link } from 'react-router';
import { MapComponent } from '../../components/map';
import { getNuts } from '../../api/geo';

const style = require('./display-map.style.scss');

export const DisplayMapComponent: React.StatelessComponent = (props) => (
  <div className={style.displayMapContainer}>
    <h1 className={style.header}>Spain Elections</h1>
    <div className={style.cardContainer}>
      <MapComponent
        nuts={getNuts(2)}
        data={null}
      />
    </div>
  </div>
);

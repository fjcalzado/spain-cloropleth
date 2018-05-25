import * as React from 'react';
import { Link } from 'react-router';
import { ElectionsMap } from '../../components/map/map';
import { MapComponent } from '../../components/map';
import { getNutFeatures } from '../../api/geo';

const classNames = require('./pageA.scss');

export const PageAComponent: React.StatelessComponent = (props) => (
  <div className={classNames.pageA}>
    <h1>Spain Elections</h1>
    {/* <ElectionsMap
      height={'500px'}
      width={'100%'}
    /> */}
    <MapComponent
      nutFeatures={getNutFeatures(3)}
      data={null}
    />
  </div>
);

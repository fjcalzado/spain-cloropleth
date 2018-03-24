import * as React from 'react';
import { Link } from 'react-router';
import { Elections } from '../../components/map';

const classNames = require('./pageA.scss');

export const PageAComponent: React.StatelessComponent = (props) => (
  <div className={classNames.pageA}>
    <h1>Spain Elections</h1>
    <Elections
      height={'500px'}
      width={'100%'}
    />
  </div>
);

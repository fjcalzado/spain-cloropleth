import * as React from 'react';
import { Link } from 'react-router';
import { Elections } from '../../components/map';

export const PageAComponent: React.StatelessComponent = (props) => (
  <div>
    <h1>Spain Elections</h1>
    <Link to="/pageB">Page B</Link>
    <Elections
      height={700}
      width={960}
    />
  </div>
);

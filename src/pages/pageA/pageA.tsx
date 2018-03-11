import * as React from 'react';
import { Link } from 'react-router';
import { Bubbles } from '../../components/bubbles';
import { Elections } from '../../components/map';

const data = [
  {id: 1, x: 250, y: 250, radius: 1},
  {id: 1, x: 100, y: 100, radius: 2},
  {id: 1, x: 50, y: 50, radius: 5},
  {id: 1, x: 300, y: 300, radius: 10},
  {id: 1, x: 400, y: 4000, radius: 20},
];

export const PageAComponent: React.StatelessComponent = (props) => (
  <div>
    <h1>Page A</h1>
    <Link to="/pageB">Page B</Link>
    <Elections
      height={700}
      width={960}
      data={data}
    />
  </div>
);

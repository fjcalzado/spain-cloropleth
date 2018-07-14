import * as React from 'react';
import { LifeExpectancyMapComponent } from './pages/lifeExpectancyMap';
import { PageBComponent } from './pages/pageB';
import { hashHistory, Router, Route } from 'react-router';

export const AppRouter: React.StatelessComponent<{}> = () => (
  <Router history={hashHistory}>
    <Route path="/" component={LifeExpectancyMapComponent}>
      <Route path="/map" component={LifeExpectancyMapComponent} />
      <Route path="/pageB" component={PageBComponent} />
    </Route>
  </Router>
);

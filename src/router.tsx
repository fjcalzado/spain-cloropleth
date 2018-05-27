import * as React from 'react';
import { DisplayMapComponent } from './pages/display-map';
import { PageBComponent } from './pages/pageB';
import { hashHistory, Router, Route } from 'react-router';

export const AppRouter: React.StatelessComponent<{}> = () => (
  <Router history={hashHistory}>
    <Route path="/" component={DisplayMapComponent}>
      <Route path="/map" component={DisplayMapComponent}/>
      <Route path="/pageB" component={PageBComponent}/>
    </Route>
  </Router>
);

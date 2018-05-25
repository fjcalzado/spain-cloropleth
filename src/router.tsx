import * as React from 'react';
import { PageAComponent } from './pages/pageA';
import { PageBComponent } from './pages/pageB';
import { hashHistory, Router, Route } from 'react-router';

export const AppRouter: React.StatelessComponent<{}> = () => (
  <Router history={hashHistory}>
    <Route path="/" component={PageAComponent}>
      <Route path="/pageA" component={PageAComponent}/>
      <Route path="/pageB" component={PageBComponent}/>
    </Route>
  </Router>
);

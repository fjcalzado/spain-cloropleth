import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import { routes } from './common/constants/routes';
import { App } from './app';
import { MapSelectorComponent } from './pages/mapSelector';
import { LifeExpectancyMapContainer } from './pages/lifeExpectancyMap';
import { ElectoralMapContainer } from './pages/electoralMap';

export const Routes = (
  <Route path={routes.defaul} component={App}>
    <IndexRoute component={MapSelectorComponent} />
    <Route path={routes.lifeExpectancyMap} component={LifeExpectancyMapContainer} />
    <Route path={routes.electoralMap} component={ElectoralMapContainer} />
  </Route>
);

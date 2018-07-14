import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import { routes } from './common/constants/routes';
import { App } from './app';
import { MapSelectorComponent } from './pages/mapSelector';
import { LifeExpectancyMapComponent } from './pages/lifeExpectancyMap';
import { ElectoralMapComponent } from './pages/electoralMap';

export const Routes = (
  <Route path={routes.defaul} component={App}>
    <IndexRoute component={MapSelectorComponent} />
    <Route path={routes.lifeExpectancyMap} component={LifeExpectancyMapComponent} />
    <Route path={routes.electoralMap} component={ElectoralMapComponent} />
  </Route>
);

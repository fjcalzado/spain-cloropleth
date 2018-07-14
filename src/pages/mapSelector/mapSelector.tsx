import * as React from 'react';
import { Link } from 'react-router';
import { routes } from '../../common/constants/routes';
const styles = require('./mapSelector.scss');

export const MapSelectorComponent: React.StatelessComponent = (props) => (
  <div className={styles.mapSelector}>
    <Link
      to={routes.lifeExpectancyMap}
    >
      Life expectancy map
    </Link>
    <Link
      to={routes.electoralMap}
    >
      Electoral map
    </Link>
  </div>
);

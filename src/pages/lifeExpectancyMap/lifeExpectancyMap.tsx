import * as React from 'react';
import { MapComponent } from '../../common/components/map';
import { mapGeoAreaListModelToVM } from './mapper';
import { getProjection } from '../../common/geo/spain';
import { LifeExpectancyEntity } from './viewModel';
import { FeatureCollection, GeometryObject } from 'geojson';
const styles = require('./lifeExpectancyMap.scss');

interface Props {
  lifeExpectancyEntities: LifeExpectancyEntity[];
  geoEntities: FeatureCollection<GeometryObject, any>;
}

export const LifeExpectancyMapComponent: React.StatelessComponent<Props> = (props) => (
  <div className={styles.lifeExpectancyMap}>
    <h1 className={styles.header}>Life expectancy map</h1>
    <div className={styles.mapContainer}>
      <MapComponent
        geoAreas={mapGeoAreaListModelToVM(props.geoEntities, props.lifeExpectancyEntities)}
        geoEntities={props.geoEntities}
        projection={getProjection()}
      />
    </div>
  </div>
);


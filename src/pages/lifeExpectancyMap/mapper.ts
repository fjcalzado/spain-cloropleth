import { FeatureCollection, GeometryObject } from 'geojson';
import { DataAPI } from '../../api/data';
import { GeoArea } from '../../common/components/map';
import { getGeoEntities, geoAreaTypes, getId } from '../../common/geo/spain';

// TODO: Remove NutsAPI and DataAPI
export const mapGeoAreaListModelToVM = (geoEntities: FeatureCollection<GeometryObject, any>, dataAPI: DataAPI): GeoArea[] => (
  geoEntities.features.map((geoEntity) => (
    mapGeoAreaModelToVM(geoEntity, dataAPI)
  ))
);

const mapGeoAreaModelToVM = (geoEntity, dataAPI: DataAPI): GeoArea => {
  const id = getId(geoEntity);
  const values = dataAPI.dataCollection.find(d => dataAPI.getKey(d).toString() === id);
  return {
    id,
    geoEntity,
    color: dataAPI.getColor(values),
    tooltipMessage: dataAPI.getTooltipContent(values),
  };
};

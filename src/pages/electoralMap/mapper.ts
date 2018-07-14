import { Feature, GeometryObject } from 'geojson';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';
import { GeoArea } from '../../common/components/map';

// TODO: Remove NutsAPI and DataAPI
export const mapGeoAreaListModelToVM = (nutsAPI: NutsAPI, dataAPI: DataAPI): GeoArea[] => (
  nutsAPI.featureCollection.features.map((geometryObject) => (
    mapGeoAreaModelToVM(geometryObject, nutsAPI, dataAPI)
  ))
);

const mapGeoAreaModelToVM = (geometryObject: Feature<GeometryObject, any>, nutsAPI: NutsAPI, dataAPI: DataAPI): GeoArea => {
  const id = nutsAPI.key(geometryObject);
  const values = dataAPI.dataCollection.find(d => dataAPI.getKey(d) === id);
  return {
    id,
    geometryObject,
    color: dataAPI.getColor(values),
    tooltipMessage: dataAPI.getTooltipContent(values),
  };
};

import { Feature, GeometryObject } from 'geojson';
import { NutsAPI } from '../../../api/geo';
import { DataAPI } from '../../../api/data';
import { Area } from './viewModel';

// TODO: Remove NutsAPI and DataAPI
export const mapAreaListModelToVM = (nutsAPI: NutsAPI, dataAPI: DataAPI): Area[] => (
  nutsAPI.featureCollection.features.map((geometryObject) => (
    mapAreaModelToVM(geometryObject, nutsAPI, dataAPI)
  ))
);

const mapAreaModelToVM = (geometryObject: Feature<GeometryObject, any>, nutsAPI: NutsAPI, dataAPI: DataAPI): Area => {
  const id = nutsAPI.key(geometryObject);
  const values = dataAPI.dataCollection.find(d => dataAPI.getKey(d) === id);
  return {
    id,
    geometryObject,
    color: dataAPI.getColor(values),
    tooltipMessage: dataAPI.getTooltipContent(values),
  };
};

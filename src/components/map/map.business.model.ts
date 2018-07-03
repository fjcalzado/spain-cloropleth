import { GeometryObject, Feature } from 'geojson';
import { NutsAPI } from '../../api/geo';
import { DataAPI } from '../../api/data';

export interface MergedNutData {
  key: any;
  nut: Feature<GeometryObject, any>;
  data: any;
}

export interface MapAPI {
  createMap: (nutsApi: NutsAPI, dataApi?: DataAPI) => void;
}

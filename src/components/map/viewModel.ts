import { Feature, GeometryObject } from 'geojson';

export interface Area {
  id: any;
  color: string;
  geometryObject: Feature<GeometryObject, any>;
}

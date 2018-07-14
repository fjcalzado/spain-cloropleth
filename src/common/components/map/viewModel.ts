import { Feature, GeometryObject } from 'geojson';

export interface GeoArea {
  id: any;
  geometryObject: Feature<GeometryObject, any>;
  color: string;
  tooltipMessage: string;
}


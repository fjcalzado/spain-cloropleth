import { Feature, GeometryObject } from 'geojson';

export interface Area {
  id: any;
  geometryObject: Feature<GeometryObject, any>;
  color: string;
  tooltipMessage: string;
}


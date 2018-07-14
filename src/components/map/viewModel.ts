import { Selection, BaseType } from 'd3-selection';
import { Feature, GeometryObject } from 'geojson';

export interface Area {
  id: any;
  color: string;
  geometryObject: Feature<GeometryObject, any>;
}

export type D3Selection = Selection<any, {}, null, undefined>;

export type Extension = [[number, number], [number, number]];

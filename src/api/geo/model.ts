import {
  FeatureCollection,
  GeometryObject,
  Feature,
  GeoJsonProperties,
  MultiLineString
} from 'geojson';
import { Topology } from 'topojson-specification';
import { GeoProjection } from 'd3';

export interface NutsLevelDescriptor {
  geoJSON: Topology;
  collectionAccessor: string;
  simplify?: number;  // Simplify threshold. 0 = no simplification.
}

export interface NutsAPI<P = GeoJsonProperties> {
  featureCollection: FeatureCollection<GeometryObject>;
  mesh: MultiLineString;
  projection?: GeoProjection;
  key: (feature: Feature<GeometryObject, P>) => any;
  name: (feature: Feature<GeometryObject, P>) => string;
}

export type NutsAPICreator<P> = (level: NutsLevelDescriptor) => NutsAPI<P>;

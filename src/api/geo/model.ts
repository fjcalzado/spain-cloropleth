import {
  FeatureCollection,
  GeometryObject,
  Feature,
  GeoJsonProperties,
  MultiLineString
} from 'geojson';

export interface NutsAPI<P = GeoJsonProperties> {
  featureCollection: FeatureCollection<GeometryObject>;
  mesh: MultiLineString;
  projection?: any;
  key: (feature: Feature<GeometryObject, P>) => any;
  name: (feature: Feature<GeometryObject, P>) => string;
}

export type NutsAPICreator<P> = (level: number, simplify?: boolean) => NutsAPI<P>;

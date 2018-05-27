import { FeatureCollection, GeometryObject } from 'geojson';

export interface Nuts {
  featureCollection: FeatureCollection<GeometryObject>;
  key: (feature: GeometryObject) => any;
  name: (feature: GeometryObject) => string;
}

export type NutsApi = (level: number, simplify?: boolean) => Nuts;

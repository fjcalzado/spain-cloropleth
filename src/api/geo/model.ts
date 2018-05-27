import { FeatureCollection, GeometryObject, Feature, GeoJsonProperties } from 'geojson';

export interface Nuts<P = GeoJsonProperties> {
  featureCollection: FeatureCollection<GeometryObject>;
  key: (feature: Feature<GeometryObject, P>) => any;
  name: (feature: Feature<GeometryObject, P>) => string;
}

export type NutsApi<P> = (level: number, simplify?: boolean) => Nuts<P>;

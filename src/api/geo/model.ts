import { FeatureCollection, GeometryObject, Feature, GeoJsonProperties } from 'geojson';

export interface NutsAPI<P = GeoJsonProperties> {
  featureCollection: FeatureCollection<GeometryObject>;
  key: (feature: Feature<GeometryObject, P>) => any;
  name: (feature: Feature<GeometryObject, P>) => string;
}

export type NutsAPICreator<P> = (level: number, simplify?: boolean) => NutsAPI<P>;

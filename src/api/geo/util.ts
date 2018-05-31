import { feature, mesh } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';
import { Topology, GeometryCollection } from 'topojson-specification';
import { GeometryObject, FeatureCollection, MultiLineString } from 'geojson';
import { NutsLevelDescriptor } from './model';

export const applySimplify = (geoJSON: Topology, simplifyThreshold: number): Topology => {
  return simplifyThreshold ?
    simplify(presimplify(geoJSON), simplifyThreshold)
    : geoJSON
}

export const extractFeaturesFromGeoJSON = (geoJSON: Topology, object: GeometryCollection):
FeatureCollection<GeometryObject> => {
  return feature(geoJSON, object);
};

export const extractMeshFromGeoJSON = (geoJSON: Topology, object: GeometryCollection): MultiLineString => {
  return mesh(geoJSON, object);
};

export const extractAllFromGeoJSON = (level: NutsLevelDescriptor) => {
  const geoJSON = applySimplify(level.geoJSON, level.simplify);
  const geometryCollection = geoJSON.objects[level.collectionAccessor] as GeometryCollection;
  const featureCollection = extractFeaturesFromGeoJSON(geoJSON, geometryCollection);
  const mesh = extractMeshFromGeoJSON(geoJSON, geometryCollection);

  return {
    featureCollection,
    mesh,
  };
}

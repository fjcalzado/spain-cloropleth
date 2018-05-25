import { feature } from 'topojson-client';
import { Topology, GeometryCollection } from 'topojson-specification';
import { GeometryObject, FeatureCollection } from 'geojson';

export const extractFeaturesFromGeoJSON = (geoJSON: Topology, object: GeometryCollection):
FeatureCollection<GeometryObject> => {
  return feature(geoJSON, object);
};

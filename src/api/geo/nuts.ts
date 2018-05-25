import { TopoJSON, Topology, GeometryCollection, GeometryObject } from 'topojson-specification';
import { FeatureCollection } from 'geojson';
import { extractFeaturesFromGeoJSON } from './util';

const municipalitiesGeoJSON = require('../../data/geo/spain-municipalities.json');
const provincesGeoJSON = null;  // TODO
const communitiesGeoJSON = require('../../data/geo/spain-communities.json');

interface NutsDescriptor {
  geoJSON: Topology;
  collectionAccessor: string;
}

const resolveLevel = (level: number): NutsDescriptor => {
  switch (level) {
    case 3:
      return {
        geoJSON: municipalitiesGeoJSON,
        collectionAccessor: 'municipalities',
      };
    case 2:
      return {
        geoJSON: provincesGeoJSON,
        collectionAccessor: 'provinces',
      };
    case 1:
    default:
      return {
        geoJSON: communitiesGeoJSON,
        collectionAccessor: 'communities',
      };
  }
};

export const getNutFeatures = (level: number) => {
  const nuts = resolveLevel(level);
  return extractFeaturesFromGeoJSON(nuts.geoJSON, nuts.geoJSON.objects[nuts.collectionAccessor] as GeometryCollection);
};

import { TopoJSON, Topology, GeometryCollection, GeometryObject } from 'topojson-specification';
import { presimplify } from 'topojson-simplify';
import { FeatureCollection } from 'geojson';
import { extractFeaturesFromGeoJSON } from './util';
import { Nuts, NutsApi } from './model';

const communitiesGeoJSON = require('../../data/geo/Spain-01-Regions.MIN.topo.json');
const provincesGeoJSON = require('../../data/geo/Spain-02-Provinces.MIN.topo.json');
const municipalitiesGeoJSON = require('../../data/geo/Spain-03-Municipalities.MIN.topo.json');

interface GeoJSONDescriptor {
  geoJSON: Topology;
  collectionAccessor: string;
}

const resolveLevel = (level: number): GeoJSONDescriptor => {
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

interface FeatureProperties {
  NATCODE: any;
  NAMEUNIT: string;
}

export const getNuts: NutsApi = (level: number, simplify: boolean = false): Nuts => {
  const descriptor = resolveLevel(level);
  const geoJSON = simplify ? presimplify(descriptor.geoJSON) : descriptor.geoJSON;
  const collection = geoJSON.objects[descriptor.collectionAccessor] as GeometryCollection;
  const featureCollection = extractFeaturesFromGeoJSON(geoJSON, collection);
  return {
    featureCollection,
    key: (feature: GeometryObject<FeatureProperties>) => {
      return (feature.properties as FeatureProperties).NATCODE;
    },
    name: (feature: GeometryObject<FeatureProperties>) => {
      return (feature.properties as FeatureProperties).NAMEUNIT;
    },
  };
};

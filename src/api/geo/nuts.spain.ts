import { TopoJSON, Topology, GeometryCollection, GeometryObject } from 'topojson-specification';
import { FeatureCollection, Feature } from 'geojson';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { extractFeaturesFromGeoJSON, extractMeshFromGeoJSON, applySimplify } from './util';
import { NutsAPI, NutsAPICreator } from './model';

const communitiesGeoJSON = require('../../data/geo/Spain-01-Regions.MIN.topo.json');
const provincesGeoJSON = require('../../data/geo/Spain-02-Provinces.MIN.topo.json');
const municipalitiesGeoJSON = require('../../data/geo/Spain-03-Municipalities.MIN.topo.json');

interface GeoJSONDescriptor {
  geoJSON: Topology;
  collectionAccessor: string;
  simplify?: number;  // Simplify threshold. 0 = no simplification.
}

const resolveLevel = (level: number): GeoJSONDescriptor => {
  switch (level) {
    case 3:
      return {
        geoJSON: municipalitiesGeoJSON,
        collectionAccessor: 'municipalities',
        simplify: 0.001,
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

export const getNuts: NutsAPICreator<FeatureProperties> = (level: number) => {
  const descriptor = resolveLevel(level);
  const geoJSON = applySimplify(descriptor.geoJSON, descriptor.simplify);
  const geometryCollection = geoJSON.objects[descriptor.collectionAccessor] as GeometryCollection;
  const featureCollection = extractFeaturesFromGeoJSON(geoJSON, geometryCollection);
  const mesh = extractMeshFromGeoJSON(geoJSON, geometryCollection);
  const projection = geoConicConformalSpain();

  return {
    featureCollection,
    mesh,
    projection,
    key: (feature) => {
      return parseInt((feature.properties as FeatureProperties).NATCODE);
    },
    name: (feature: Feature<GeometryObject, FeatureProperties>) => {
      return (feature.properties as FeatureProperties).NAMEUNIT;
    },
  };
};

import { GeometryObject } from 'topojson-specification';
import { Feature } from 'geojson';
import { geoConicConformalSpain } from 'd3-composite-projections';
import { extractAllFromGeoJSON } from './util';
import { NutsAPI, NutsAPICreator, NutsLevelDescriptor } from './model';

const communitiesGeoJSON = require('../../data/geo/Spain-01-Regions.MIN.topo.json');
const provincesGeoJSON = require('../../data/geo/Spain-02-Provinces.MIN.topo.json');
const municipalitiesGeoJSON = require('../../data/geo/Spain-03-Municipalities.MIN.topo.json');

export const spainLevel4: NutsLevelDescriptor = {
  geoJSON: municipalitiesGeoJSON,
  collectionAccessor: 'municipalities',
  simplify: 0.001,
};
export const spainLevel3: NutsLevelDescriptor = {
  geoJSON: provincesGeoJSON,
  collectionAccessor: 'provinces',
};
export const spainLevel2: NutsLevelDescriptor = {
  geoJSON: communitiesGeoJSON,
  collectionAccessor: 'communities',
};

interface FeatureProperties {
  NATCODE: any;
  NAMEUNIT: string;
}

export const getNuts: NutsAPICreator<FeatureProperties> = (level: NutsLevelDescriptor) => {
  const {featureCollection, mesh} = extractAllFromGeoJSON(level);

  return {
    featureCollection,
    mesh,
    projection: geoConicConformalSpain(),
    key: (feature) => {
      return parseInt((feature.properties as FeatureProperties).NATCODE);
    },
    name: (feature: Feature<GeometryObject, FeatureProperties>) => {
      return (feature.properties as FeatureProperties).NAMEUNIT;
    },
  };
};

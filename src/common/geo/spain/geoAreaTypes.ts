import { GeoAreaType } from "./model";

const communitiesGeoJSON = require('./topojson/Spain-02-Communities.MIN.topo.json');
const provincesGeoJSON = require('./topojson/Spain-03-Provinces.MIN.topo.json');
const municipalitiesGeoJSON = require('./topojson/Spain-04-Municipalities.MIN.topo.json');

const communities: GeoAreaType = {
  name: 'communities',
  geoJSON: communitiesGeoJSON,
};

const provinces: GeoAreaType = {
  name: 'provinces',
  geoJSON: provincesGeoJSON,
};

const municipalities: GeoAreaType = {
  name: 'municipalities',
  geoJSON: municipalitiesGeoJSON,
  simplificationFactor: 0.001,
};

export const geoAreaTypes = {
  communities,
  provinces,
  municipalities,
};

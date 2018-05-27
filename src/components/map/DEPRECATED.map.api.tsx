const municipalitiesdata = require('../../data/geo/spain-municipalities.json');
const regionsdata = require('../../data/geo/spain-communities.json');
const electionResults = require('../../data/mock/election-result.json');

export const loadJson = (filePath: string) => {
  fetch(filePath)
    .then((res) => res.json())
    .then((data) => {
      // console.log('data:', data);
    });
};

export const loadMunicipalities = () => {
  return municipalitiesdata;
};

export const loadRegions = () => {
  return regionsdata;
};

export const loadElectionsData = () => {
  return electionResults;
};

const resultsColorScheme = new Map();
resultsColorScheme.set('PP', '#0cb2ff');
resultsColorScheme.set('PSOE', '#ff0000');
resultsColorScheme.set('PODEMOS', '#9a569a');
resultsColorScheme.set('CS', '#fca501');

export const loadColorScheme = () => resultsColorScheme;

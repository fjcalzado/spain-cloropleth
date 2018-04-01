const municipalitiesdata = require('../content/data/spain-municipalities.json');
const regionsdata = require('../content/data/spain-comunidad.json');
const resultsTsv = require('../content/data/results-fake.tsv');

export const loadJson = (filePath: string) => {
  fetch(filePath)
    .then((res) => res.json())
    .then((data) => {
      console.log('data:', data);
    });
};

export const loadMunicipalities = () => {
  return municipalitiesdata;
};

export const loadRegions = () => {
  return regionsdata;
};

export const loadElectionsData = () => {
  return resultsTsv;
};

const resultsColorScheme = new Map();
resultsColorScheme.set('PP', '#0cb2ff');
resultsColorScheme.set('PSOE', '#ff0000');
resultsColorScheme.set('PODEMOS', '#9a569a');
resultsColorScheme.set('CS', '#fca501');

export const loadColorScheme = () => resultsColorScheme;

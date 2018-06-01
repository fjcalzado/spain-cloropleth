import { DataAPI, DataAPICreator } from "./model";

const electionsJSON = require('../../data/mock/election-result.spain.json');

interface ElectionDatum {
  id: number;
  name: string;
  region: string;
  province: string;
  party: string;
}

export const getElectionData: DataAPICreator<ElectionDatum> = () => {
  return {
    dataCollection: electionsJSON,
    getKey: (datum) => datum.id,
    getName: (datum) => datum.name,
    getTooltipContent,
    getColor,
  };
}

const getTooltipContent = (datum: ElectionDatum) => (
  datum ? (
    `
    <h4>${datum.name}</h4>
    <h3>${datum.party}</h3>
    `
  ) : '<h4>Sin Datos</h4>'
);

const getColor = (datum: ElectionDatum) => {
  switch (datum && datum.party) {
    case 'PP': return '#0cb2ff';
    case 'PSOE': return '#ff0000';
    case 'PODEMOS': return '#9a569a';
    case 'CS': return '#fca501';
    default: return 'lightgrey';
  }
};

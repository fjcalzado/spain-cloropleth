import { DataAPI, DataAPICreator } from "./model";

const electionsJSON = require('../../data/mock/election-result.json');

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
  };
}

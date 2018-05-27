import { DataAPI } from "./model";

const electionsJSON = require('../../data/mock/election-result.json');

interface ElectionDatum {
  id: number;
  name: string;
  region: string;
  province: string;
  party: string;
}

export const getElectionData: DataAPI<ElectionDatum> = () => {
  return {
    dataCollection: electionsJSON,
    key: (datum) => datum.id,
    name: (datum) => datum.name,
  };
}

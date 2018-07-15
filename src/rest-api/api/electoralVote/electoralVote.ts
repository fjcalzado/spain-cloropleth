import { ElectoralVoteEntity } from '../../model';

const electoralVoteEntities: any[] = require('./election-result.spain.json');

const fetchElectoralVoteEntities = (): Promise<ElectoralVoteEntity[]> => (
  Promise.resolve(electoralVoteEntities.map(mapLifeExpectancyModel))
);

const mapLifeExpectancyModel = (electoralVoteEntity): ElectoralVoteEntity => ({
  ...electoralVoteEntity,
})

export const electoralVoteAPI = {
  fetchElectoralVoteEntities,
};

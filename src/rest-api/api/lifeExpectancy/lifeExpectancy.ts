import { LifeExpectancyEntity } from '../../model';

const lifeExpectancyEntities: any[] = require('./life-expectancy.2016.spain.json');

const fetchLifeExpectancyEntities = (): Promise<LifeExpectancyEntity[]> => (
  Promise.resolve(lifeExpectancyEntities.map(mapLifeExpectancyModel))
);

const mapLifeExpectancyModel = (lifeExpectancyEntity): LifeExpectancyEntity => ({
  ...lifeExpectancyEntity,
})

export const lifeExpectancyAPI = {
  fetchLifeExpectancyEntities,
};

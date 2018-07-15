import { LifeExpectancy } from '../../model/lifeExpectancy';

const lifeExpectancyJSON: any[] = require('./life-expectancy.2016.spain.json');

const fetchLifeExpectancy = (): Promise<LifeExpectancy[]> => (
  Promise.resolve(lifeExpectancyJSON.map(mapLifeExpectancyModel))
);

const mapLifeExpectancyModel = (lifeExpectancy): LifeExpectancy => ({
  ...lifeExpectancy,
})

export const lifeExpectancyAPI = {
  fetchLifeExpectancy,
};

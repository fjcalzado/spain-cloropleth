import { scaleLinear } from "d3-scale";
import { interpolateBuGn } from "d3-scale-chromatic";
import { DataAPI, DataAPICreator } from "./model";

const lifeExpectancyJSON = require('../../data/mock/life-expectancy.2016.spain.json');

interface LifeExpectancyDatum {
  id: number;
  name: string;
  both: number;
  men: number;
  women: number;
}

const GROUP = 'both';

export const getLifeExpectancyData: DataAPICreator<LifeExpectancyDatum> = () => {
  const lifeScale = scaleLinear().domain(getMinMax(lifeExpectancyJSON, GROUP)).range([0, 1]);

  return {
    dataCollection: lifeExpectancyJSON,
    getKey: (datum) => datum.id,
    getName: (datum) => datum.name,
    getTooltipContent,
    getColor: getColor(lifeScale),
  };
}

const getMinMax = (lifeExpectancy: LifeExpectancyDatum[], field: string) => {
  const years = lifeExpectancy.map(d => d[field]);
  return [Math.min(...years), Math.max(...years)]
}

const getTooltipContent = (datum: LifeExpectancyDatum) => (
  datum ? (
    `
    <h4>${datum.name}</h4>
    <h3>${datum[GROUP].toFixed(2)} años</h3>
    `
  ) : '<h4>Sin Datos</h4>'
);

const getColor = (scale) => (datum: LifeExpectancyDatum) => {
  return (datum && datum[GROUP]) ?
    interpolateBuGn(scale(datum[GROUP])) : "lightgrey";
};

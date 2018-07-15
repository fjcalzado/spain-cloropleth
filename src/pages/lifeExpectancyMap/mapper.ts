import { FeatureCollection, GeometryObject } from 'geojson';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { interpolateBuGn } from 'd3-scale-chromatic';
import { GeoArea, createEmptyGeoArea } from '../../common/components/map';
import { getId } from '../../common/geo/spain';
import * as vm from './viewModel';
import * as model from '../../rest-api/model/lifeExpectancy';


export const mapLifeExpectancyEntitiesModelToVM = (lifeExpectancyEntities: model.LifeExpectancy[]): vm.LifeExpectancyEntity[] => (
  Boolean(lifeExpectancyEntities) ?
    lifeExpectancyEntities.map(mapLifeExpectancyEntityModelToVM) :
    []
);

const mapLifeExpectancyEntityModelToVM = (lifeExpectancyEntity: model.LifeExpectancy): vm.LifeExpectancyEntity => (
  Boolean(lifeExpectancyEntity) ?
    {
      id: lifeExpectancyEntity.id.toString(),
      name: lifeExpectancyEntity.name,
      both: lifeExpectancyEntity.both
    } :
    vm.createEmptyLifeExpectancyEntity()
);

export const mapGeoAreaListModelToVM = (geoEntities: FeatureCollection<GeometryObject, any>, lifeExpectancyEntities: vm.LifeExpectancyEntity[]): GeoArea[] => (
  Boolean(geoEntities) ?
    geoEntities.features.map((geoEntity) => (
      mapGeoAreaModelToVM(geoEntity, lifeExpectancyEntities)
    )) :
    []
);

const mapGeoAreaModelToVM = (geoEntity, lifeExpectancyEntities: vm.LifeExpectancyEntity[]): GeoArea => {
  const id = getId(geoEntity);
  const lifeExpectancy = lifeExpectancyEntities.find(l => l.id === id);
  const scale = getScale(lifeExpectancyEntities);

  return Boolean(lifeExpectancy) ?
    {
      id,
      geoEntity,
      color: getColor(lifeExpectancy, scale),
      tooltipMessage: getTooltipMessage(lifeExpectancy),
    } :
    createEmptyGeoArea();
};

const getColor = (lifeExpectancyEntity: vm.LifeExpectancyEntity, scale: ScaleLinear<number, number>) => (
  interpolateBuGn(scale(lifeExpectancyEntity.both))
);

const getScale = (lifeExpectancyEntities: vm.LifeExpectancyEntity[]) => (
  scaleLinear()
    .domain(getDomain(lifeExpectancyEntities))
    .range([0, 1])
);

const getDomain = (lifeExpectancyEntities: vm.LifeExpectancyEntity[]) => {
  const years = lifeExpectancyEntities.map((l) => l.both);
  return [Math.min(...years), Math.max(...years)];
};

const getTooltipMessage = (lifeExpectancyEntity: vm.LifeExpectancyEntity) => (
  Boolean(lifeExpectancyEntity) ?
    `
      <h4>${lifeExpectancyEntity.name}</h4>
      <h3>${lifeExpectancyEntity.both.toFixed(2)} años</h3>
    `:
    '<h4>Sin Datos</h4>'
)

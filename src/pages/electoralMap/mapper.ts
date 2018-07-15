import { FeatureCollection, GeometryObject } from 'geojson';
import { GeoArea, createEmptyGeoArea } from '../../common/components/map';
import { getId } from '../../common/geo/spain';
import * as vm from './viewModel';
import * as model from '../../rest-api/model';


export const mapElectoralVoteEntitiesModelToVM = (electoralVoteEntities: model.ElectoralVoteEntity[]): vm.ElectoralVoteEntity[] => (
  Boolean(electoralVoteEntities) ?
    electoralVoteEntities.map(mapElectoralVoteEntityModelToVM) :
    []
);

const mapElectoralVoteEntityModelToVM = (electoralVoteEntity: model.ElectoralVoteEntity): vm.ElectoralVoteEntity => (
  Boolean(electoralVoteEntity) ?
    {
      id: electoralVoteEntity.id.toString(),
      name: electoralVoteEntity.name,
      region: electoralVoteEntity.region,
      province: electoralVoteEntity.province,
      party: electoralVoteEntity.party,
    } :
    vm.createEmptyElectoralVoteEntity()
);

export const mapGeoAreaListModelToVM = (geoEntities: FeatureCollection<GeometryObject, any>, lifeExpectancyEntities: vm.ElectoralVoteEntity[]): GeoArea[] => (
  Boolean(geoEntities) ?
    geoEntities.features.map((geoEntity) => (
      mapGeoAreaModelToVM(geoEntity, lifeExpectancyEntities)
    )) :
    []
);

const mapGeoAreaModelToVM = (geoEntity, electoralVoteEntities: vm.ElectoralVoteEntity[]): GeoArea => {
  const id = getId(geoEntity);
  const electoralVoteEntity = electoralVoteEntities.find(l => l.id === id);

  return Boolean(electoralVoteEntity) ?
    {
      id,
      geoEntity,
      color: getColor(electoralVoteEntity),
      tooltipMessage: getTooltipMessage(electoralVoteEntity),
    } :
    createEmptyGeoArea();
};

const partyColors = {
  'PP': '#0cb2ff',
  'PSOE': '#ff0000',
  'PODEMOS': '#9a569a',
  'CS': '#fca501',
}
const getColor = (electoralVoteEntity: vm.ElectoralVoteEntity, ) => (
  partyColors[electoralVoteEntity.party]
);

const getTooltipMessage = (electoralVoteEntity: vm.ElectoralVoteEntity) => (
  Boolean(electoralVoteEntity) ?
    `
      <h4>${electoralVoteEntity.name}</h4>
      <h3>${electoralVoteEntity.party}</h3>
    `:
    '<h4>Sin Datos</h4>'
)

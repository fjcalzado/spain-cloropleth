import { geoConicConformalSpain } from 'd3-composite-projections';

export interface MapSetup {
  width: number;
  height: number;
  internalPadding: number;
  projection: any;  // TODO. D3 typings are broken (may 18).
}

export const defaultMapSetup: MapSetup = {
  width: 700,
  height: 500,
  internalPadding: 20,
  projection: geoConicConformalSpain(),
};

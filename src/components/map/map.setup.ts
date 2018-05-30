import { geoMercator } from 'd3-geo';

export interface MapSetup {
  width: number;
  height: number;
  internalPadding: number;
  defaultProjection: any;  // TODO. D3 typings are broken (may 18).
  maxZoomScale: number;
}

export const defaultMapSetup: MapSetup = {
  width: 700,
  height: 500,
  internalPadding: 20,
  defaultProjection: geoMercator(),  // Default visualization projection.
  maxZoomScale: 25,
};

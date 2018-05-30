import { geoMercator } from 'd3-geo';

export interface MapSetup {
  width: number;
  height: number;
  internalPadding: number;
  defaultProjection: any;  // TODO. D3 typings are broken (may 18).
  defaultFillColor: string;
  maxZoomScale: number;
  clickZoomFitScale: number;
}

export const defaultMapSetup: MapSetup = {
  width: 700,
  height: 500,
  internalPadding: 20,
  defaultProjection: geoMercator(),
  defaultFillColor: 'lightgrey',
  maxZoomScale: 30,
  clickZoomFitScale: 0.65,
};

/**
 * width = width of the SVG ViewBox.
 * It represent the extent width of the internal SVG coordinate system.
 *
 * height = height of the SVG ViewBox.
 * It represent the extent height of the internal SVG coordinate system.
 *
 * internalPadding = padding in pixels of the SVG ViewBox.
 * Inner padding to be left blank in SVG container with no Zoom applied.
 * Once zoomed, map will cover all the SVG area.
 *
 * defaultProjection = default projection used for visualizing the map.
 * This is the projection used if NUT does not specify a custom projection.
 *
 * maxZoomScale = maximum level of zoom allowed.
 *
 * clickZoomFitScale = zoom level respect the clicked element, so that
 * - 1 means the element will be zoomed to cover the whole current viewport.
 * - 0,5 means the element will be zoomed to cover half the current viewport.
 * and so on.
 *
 */

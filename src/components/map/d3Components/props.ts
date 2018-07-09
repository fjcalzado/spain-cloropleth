import { GeoProjection } from 'd3-geo';
import { NutsAPI } from '../../../api/geo';
import { DataAPI } from '../../../api/data';
import { D3Selection } from './types';

export interface Props {
  root: D3Selection<HTMLDivElement>;
  svg: D3Selection<SVGSVGElement>;
  nuts: NutsAPI;
  data?: DataAPI;
  width?: number;
  height?: number;
  internalPadding?: number;
  defaultProjection?: GeoProjection;
  fillColor?: string;
  maxZoomScale?: number;
  clickZoomFitScale?: number;
}

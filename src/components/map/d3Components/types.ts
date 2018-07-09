import { Selection, BaseType } from 'd3-selection';

export type D3Selection<T extends BaseType> = Selection<T, {}, null, undefined>;

export type Extent = [[number, number], [number, number]];

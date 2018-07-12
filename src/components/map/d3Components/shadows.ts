import { D3Selection } from './types';

const SVG_SHADOW_ID = 'svgshadow';

export const renderShadowDefinitions = (svg: D3Selection<any>): D3Selection<any> => {
  const defs = svg.append('defs');
  const filter = defs
    .append('filter')
    .attr('id', SVG_SHADOW_ID)
    .attr('filterUnits', 'userSpaceOnUse');

  filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 3);

  filter.append('feOffset')
    .attr('dx', 0)
    .attr('dy', 0);

  filter.append('feComponentTransfer')
    .append('feFuncA')
    .attr('type', 'linear')
    .attr('slope', 0.2);

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode');
  feMerge.append('feMergeNode')
    .attr('in', 'SourceGraphic');

  return defs;
}

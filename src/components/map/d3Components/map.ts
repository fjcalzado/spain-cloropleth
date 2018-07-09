import { select } from 'd3-selection';
import { Props } from './props';
import { renderShadowDefinitions } from './shadows';
import { Extent } from './types';

export const renderMap = (props: Props) => {
  const extent = calculateExtent(props);
  renderShadowDefinitions(props.svg);
}

const calculateExtent = ({ width, height, internalPadding }: Props): Extent => ([
  [internalPadding, internalPadding],
  [width - internalPadding, height - internalPadding]
])

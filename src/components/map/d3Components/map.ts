import { Props } from './props';
import { renderShadowDefinitions } from './shadows';
import { Extent } from './types';
import { zoomComponent } from './zoom/zoom';
import { mergeNutsAndData } from '../map.business.behaviour';

export const renderMap = (props: Props) => {
  const extent = calculateExtent(props);
  renderShadowDefinitions(props.svg);
  zoomComponent({
    svg: props.svg,
    width: props.width,
    height: props.height,
    maxZoomScale: props.maxZoomScale,
    clickZoomFitScale: props.clickZoomFitScale,
    extent,
    data: mergeNutsAndData(props.nuts, props.data), // TODO Refactor
  })
}

const calculateExtent = ({ width, height, internalPadding }: Props): Extent => ([
  [internalPadding, internalPadding],
  [width - internalPadding, height - internalPadding]
])

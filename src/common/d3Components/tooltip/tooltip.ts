import { D3Selection } from '../../types';
import { cnc } from '../../../utils/classname';
import { mouse } from 'd3';
const styles = require('./tooltip.scss');

interface Props {
  node: D3Selection;
  xOffset?: number;
  yOffset?: number;
}

interface State {
  tooltip: D3Selection;
}

export const tooltipComponent = (props: Props) => {
  const state = createEmptyState();
  state.tooltip = render(props);

  return {
    onShowTooltip: onShowTooltip(props, state),
    onHideTooltip: onHideTooltip(state),
    onUpdateTooltipPosition: onUpdateTooltipPosition(props, state),
  };
};

const createEmptyState = (): State => ({
  tooltip: null,
});

const render = (props: Props) => props.node
  .append('div')
  .attr('class', cnc(styles.tooltip, styles.hidden))

const onShowTooltip = (props: Props, state: State) => (message: string) => showTooltip(props, state, message);

const showTooltip = (props: Props, state: State, message: string) => {
  state.tooltip
    .html(message);
  updateTooltipPosition(props, state);
  state.tooltip
    .classed(styles.hidden, false);
};

const onUpdateTooltipPosition = (props: Props, state: State) => () => updateTooltipPosition(props, state);

const updateTooltipPosition = ({ xOffset = 25, yOffset = 40 }: Props, state: State) => {
  const [x, y] = mouse(document.body);

  state.tooltip
    .style('left', `${x + xOffset}px`)
    .style('top', `${y + yOffset}px`);
};

const onHideTooltip = (state: State) => () => hideTooltip(state);

const hideTooltip = (state: State) => state.tooltip
  .classed(styles.hidden, true);

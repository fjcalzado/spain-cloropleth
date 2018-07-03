import * as React from 'react';
import { cnc } from '../../../../utils/classname';
const styles = require('./tooltip.scss');

interface Props {
  onSetRef: (node) => void;
}

export const TooltipComponent: React.StatelessComponent<Props> = (props) => (
  <div
    ref={props.onSetRef}
    className={cnc(styles.tooltip, styles.hidden)}
  >
  </div>
)

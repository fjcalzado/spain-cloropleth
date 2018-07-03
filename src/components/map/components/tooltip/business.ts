import { mouse } from 'd3-selection';
import { DataAPI } from '../../../../api/data';
import { MergedNutData } from '../../map.business.model';
const styles = require('./tooltip.scss');

export const showTooltip = (datum: MergedNutData, tooltip, dataApi: DataAPI) => {
  if (tooltip && dataApi) {
    tooltip.html(dataApi.getTooltipContent(datum.data));
    updateTooltipPosition(tooltip);
    tooltip.classed(styles.hidden, false);
  }
};

export const hideTooltip = (tooltip) => {
  if (tooltip) tooltip.classed(styles.hidden, true);
};

export const updateTooltipPosition = (tooltip) => {
  if (tooltip) {
    const mousePosX = mouse(document.body)[0] + 25;
    const mousePosY = mouse(document.body)[1] + 40;
    tooltip
      .style('left', `${mousePosX}px`)
      .style('top', `${mousePosY}px`)
  }
};

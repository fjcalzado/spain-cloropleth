export interface DataAPI<D = any> {
  dataCollection: Array<D>;
  getKey: (datum: D) => any;
  getName: (datum: D) => string;
  getTooltipContent?: (datum: D) => any;
  getColor?: (datum: D) => string;
}

export type DataAPICreator<D> = () => DataAPI<D>;

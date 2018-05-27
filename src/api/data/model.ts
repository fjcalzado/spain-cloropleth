export interface Data<D = any> {
  dataCollection: Array<D>;
  key: (datum: D) => any;
  name: (datum: D) => string;
}

export type DataAPI<D> = () => Data<D>;

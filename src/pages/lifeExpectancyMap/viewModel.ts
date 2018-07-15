export interface LifeExpectancyEntity {
  id: string;
  name: string;
  both: number;
}

export const createEmptyLifeExpectancyEntity = (): LifeExpectancyEntity => ({
  id: '',
  name: '',
  both: 0,
})

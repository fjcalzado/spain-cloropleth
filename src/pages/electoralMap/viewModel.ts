export interface ElectoralVoteEntity {
  id: string;
  name: string;
  region: string;
  province: string;
  party: string;
}

export const createEmptyElectoralVoteEntity = (): ElectoralVoteEntity => ({
  id: '',
  name: '',
  region: '',
  province: '',
  party: '',
});

export interface Municipality {
  id: number;
  status: number;
  departamentId: number;
  departamentName: string;
  name: string;
}

export interface CreateModelMunicipality {
  id: number,
  status: number;
  departamentName: string;
  departamentId: number;
  name: string;
}

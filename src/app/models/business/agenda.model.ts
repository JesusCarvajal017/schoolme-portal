export interface AgendaModel{
  id?: number;
  status: number;
  name: string;
  description: string;
}

export interface AgendaQuery {
    id: number;
    status: number;
    name: string;
    description: string;
}

export interface CompositionAgendaModel {
  id?: number;
  status: number;
  agendaId: number;
  questionId: number;
}


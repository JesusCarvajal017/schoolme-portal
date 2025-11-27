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


export interface AgendaDayModel {
  id?: number;
  status: number;
  groupId: number;
  agendaId: number;
  date: string;        // "YYYY-MM-DD"
  openedAt: string;    // ISO datetime
  closedAt?: string;    // ISO datetime
}


export interface AgendaDayStudentModel {
  status: number;
  agendaDayId: number;
  studentId: number;
  agendaDayStudentStatus: number;
  completedAt: string;
}

// intefaz de estudiante de agenda day student
export interface AgendaDayStudentHeader {
  agendaDayStudentId: number;
  studentId: number;
  fullName: string;
  document: string;
}



// modelos de vista de agenda mas especificos para no confundirse:
export interface QuestionOptionCompositionDto {
  id: number;
  questionId: number;
  text: string;
  order?: number | null;
  status: number;
}

export interface QuestionCompositionQueryDto {
  id: number;
  text: string;
  typeAnswerId: number;
  nameAnswer: string; 
  status: number;
  options: QuestionOptionCompositionDto[];
}

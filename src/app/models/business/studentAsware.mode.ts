export interface StudentAnswerInputDto {
  questionId: number;
  valueText?: string | null;
  valueBool?: boolean | null;
  valueNumber?: number | null;
  valueDate?: string | null;     // o Date, HttpClient lo serializa a ISO
  optionIds?: number[] | null;
}

export interface RegisterGlobalStudentAnswersDto {
  agendaDayId: number;
  groupId: number;
  answers: StudentAnswerInputDto[];
}

export interface StudentAnswerModel {
  id: number;
  status: number;
  agendaDayStudentId: number;
  questionId: number;
  valueText: string;
  valueBool: boolean;
  valueNumber: number;
  valueDate: string;   // ISO datetime
}
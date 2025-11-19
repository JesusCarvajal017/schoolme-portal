
export interface QuestionCreate {
  id?: number;
  status: number;
  text: string;
  typeAnswerId: number;
}

export interface QuestionModel {
  text: string;
  typeAnswerId: number;
  nameAnswer: string;
  id: number;
  status: number;
}

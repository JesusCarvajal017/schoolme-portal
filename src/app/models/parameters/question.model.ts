
export interface QuestionCreate {
  id?: number;
  status: number;
  text: string;
  typeAnswerId: number;
  options?: QuestionOptionCreate[];  
}


export interface QuestionCompositionModel {
  text: string;
  typeAnswerId: number;
  nameAnswer: string;
  id: number;
  status: number;
}

export interface QuestionModel {
  text: string;
  typeAnswerId: number;
  nameAnswer: string;
  id: number;
  status: number;
  options?: QuestionOptionCreate[];  
}

export interface QuestionOptionCreate {
  id?: number;      
  text: string;
  order?: number;
  status: number;
}
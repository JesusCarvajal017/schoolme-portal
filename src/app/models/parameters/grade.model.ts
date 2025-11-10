export interface Grade{
    id : number; 
    name: string;
    status: number;
}

export interface CreateModelGrade{
    id? : number;
    name: string;
    status: number;
}
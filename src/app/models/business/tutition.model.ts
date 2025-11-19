export interface TutionCreateModel {
    studentId: number;
    status: number; 
    gradeId: number; 
}

export interface TutionQuery {
    studentId: number;
    fullName: string;
    fisrtName: string;     
    secondName: string;
    lastName: string;
    secondLastName: string;
    gradeId: number;
    gradeName: string;
    id: number;
    status: number;  
}
export interface Groups{
    id: number;
    name: string;
    gradeId: number;
    gradeName: string;
    amountStudents: string;
    agendaId: number;
    status: number;
}
export interface CreateModelGroups{
    id: number;
    name: string;
    gradeId: number;
    gradeName: string;
    amountStudents: string;
    agendaId: number;
    status: number;
}

export interface QGroupAgendaRelation{
    id: number, 
    name: string,
    isAssigned : boolean;  
}
export interface GroupDirector {
    id: number;
    teacherId: number;
    fisrtName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    groupId: number;
    nameGroup: string;
    status: number;
}

export interface CreateModelGroupDirector{
    id: number;
    teacherId: number;
    fisrtName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    groupId: number;
    groupName: string;
    status: number;
}

export interface GroupDirectorQuery
{
    teacherId: number;
    groupId: number;
    nameGroup: string;
    nameGrade: string;
    amountStudents: number;
    id: number;
    status: number;
    agendaState: number;
    agendaId?: number;
    agendaDayId?:number;

}
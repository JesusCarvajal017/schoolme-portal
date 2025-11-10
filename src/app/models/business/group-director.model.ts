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
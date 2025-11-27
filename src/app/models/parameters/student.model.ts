import { PersonComplete } from "../security/person.model";

export interface Student {
    id: number;
    personId: number;
    fullName: string;
    groupId: number;
    documentTypeId: string;
    acronymDocument: string;
    identification: string;
    groupName: string;
    status: number;
}


export interface CreateModelStudent{
    id?: number;
    personId: number;
    groupId?: number;
    status: number;
}

export interface StudentComplete {
    id: number;
    personId: number;
    status: number;
    groupId: number;
    person: PersonComplete;
}

export interface UpdateGrupStudent {
    id: number;
    groupId: number;
}
export interface Teacher{
    id: number;
    personId: number;
    fullName: string;
    documentTypeId: string;
    acronymDocument: string;
    identification: string;
    status: number;
}
export interface CreateModelTeacher{
    id: number;
    personId: number;
    status: number;
}
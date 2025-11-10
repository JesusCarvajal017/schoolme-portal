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
    id: number;
    personId: number;
    groupName: string;
    fullName: string;
    groupId: number;
    status: number;
}
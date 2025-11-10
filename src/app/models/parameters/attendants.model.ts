export interface Attendants {
    id: number;
    personId: number;
    nameAttendant: string;
    documentTypeId: string;
    acronymDocument: string;
    identification: string;
    status: number;
}
export interface CreateModelAttendants{
    id: number;
    personId: number;
    fullName: string;
    status: number;
}
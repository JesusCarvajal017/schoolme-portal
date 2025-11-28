export interface Subject {
    id: number;
    name: string;
    status: number;
}

export interface CreateModelSubject {
    id?: number;
    name: string;
    status: number;
}

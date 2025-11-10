export interface UserRol{
    id: number;
    userId: number;
    nameUser: string;
    rolId: number;
    rolName: string;
    status: number;
}
export interface CreateModelUserRol{
    id: number;
    userId: number;
    rolId: number;
    nameUser: string;
    rolName: string;
    status: number;
}

export interface User {
    id: number;
    email: string;
    status?: number;
}

export interface Rol {
    id: number;
    name: string;
    description: string;
    status: number;
}
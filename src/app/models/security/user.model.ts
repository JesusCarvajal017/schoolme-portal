
export interface User {
    id: number;
    email: string;
    password: string;
    photo: string;
    personId: number;
    status: number;
}

export interface CreateModelUser{
    email: string;
    password: string;
    status: number;   
}

export interface CreateModolUser2{
    id?: number,
    photo?: File,
    email: string;
    password: string;
    personId: number,
    status: number; 
}


export interface PasswordsNew {
    idUser: number,
    passwordNew: string,
    passwordConfirm: string
}
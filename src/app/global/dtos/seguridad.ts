export interface CredencialesUsuario {
    email : string; 
    password : string;
}

export interface RespondAuth {
    token : string; 
    expiracion : Date;

}

export interface ResponseNoAutorizado {
    message : string;
}
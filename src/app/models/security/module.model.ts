export interface Module {
    id: number;
    name: string;
    description: string;
    icon: string;
    path: string;
    orden: number;
    status: number;

}
export interface CreateModelModule{
    id? : number;
    name: string;
    description: string;
    status: number;
}
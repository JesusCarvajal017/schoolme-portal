export interface Gender {
    id : number,
    value: string,
    name: string
}

export const GenderType : Gender[] = [
   {id: 1,value: 'M', name: 'Masculino'},
    {id: 2,value: 'F', name: 'Femenino'},
    {id: 3,value: 'O', name: 'No binario'},
    {id: 4,value: 'T', name: 'Transgénero'},
    {id: 5,value: 'NA', name: 'Prefiere no decir'},
]
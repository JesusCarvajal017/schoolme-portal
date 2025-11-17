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


export interface RelationShipTypeEnum{
    id : number,
    value: string,
    name: string
}

export const RelationShipType : RelationShipTypeEnum[] = [
    {id: 1,value: 'P', name: 'Padre'},
    {id: 2,value: 'F', name: 'Madre'},
    {id: 3,value: 'O', name: 'Abuelo'},
    {id: 4,value: 'T', name: 'Abuela'},
    {id: 5,value: 'NA', name: 'Tutor'},
]

export function getRelationrNameById(id: number): string | undefined {
  return RelationShipType.find(g => g.id === id)?.name;
}
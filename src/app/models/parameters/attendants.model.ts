export interface Attendants {
  attendantId: number,
  nameAttendant: string,
  relationShipType: number,
  documentTypeId: number,
  nameStudent: string;
  acronymDocument: string,
  identification: number,
  id: number,
  status: number 
}

export interface CreateModelAttendants{
  status: number;
  personId: number;
  relationShipTypeEnum: number;
  studentId: number;
}
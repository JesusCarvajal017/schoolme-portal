import { TuiDay } from "@taiga-ui/cdk/date-time";
import { CreateDataBasic, DataBasic, DataBasicComplete } from "../business/dataBasic.mode";

// Person data es de Santiago, lo necesito para perfil
export interface PersonData {
  documentTypeId: number;
  acronymDocument: string;
  identification: number;
  fisrtName: string;
  secondName: string | null;
  lastName: string;
  secondLastName: string | null;
  phone: number;
  gender: number;
  rhId: number;
  rhName: string;
  adress: string;
  brithDate: string;
  stratumStatus: number;
  materialStatusId: number;
  epsId: number;
  epsName: string;
  munisipalityId: number;
  munisipalityName: string;
  id: number;
  status: number;
}

export interface Person{
  id: number;
  status: number;
  documentTypeId: number;
  identification: number;
  fisrtName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  phone: number;
  fullName: string;
  gender: number;
  dataBasic: CreateDataBasic;

}


export interface PersonOrigin{
   id: number;
    documentTypeId: number;
    identification: string;
    fisrtName: string;
    fullName: string;
    secondName: string;
    lastName: string;
    secondLastName: string;
    phone: string;
    gender: number;
    acronymDocument: string;
    // age: number;
    status: number;

}

export interface CreateModelPerson{
  id?: number;
  status: number;
  documentTypeId: number;
  identification: number;
  fisrtName: string;
  secondName: string;
  fullName: string;
  lastName: string;
  secondLastName: string;
  phone: number;
  gender: number;
  dataBasic: CreateDataBasic;
}

export interface PersonComplete {
  id?: number;
  status: number;
  fullName: string;
  documentTypeId: number;
  identification: number;
  fisrtName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  phone: number;
  gender: number;
  dataBasic: DataBasicComplete;
}


// modelo para el formulario reactivo
export type FormPersonValue = {
  status: boolean;
  documentTypeId: number | null;
  fisrtName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  identification: number | null;
  phone: number | null;
  gender: number | null;
  rhId: number | null;
  adress: string;
  brithDate: TuiDay | null;       
  stratumStatus: boolean;
  materialStatusId: number | null;
  epsId: number | null;
  munisipalityId: number | null;
  departamentId: number | null;
};

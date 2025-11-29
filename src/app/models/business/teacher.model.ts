import { PersonComplete } from "../security/person.model";

export interface teacherComplete {
    personId: number;
    status: number; 
    id: number;
    person: PersonComplete; 
}
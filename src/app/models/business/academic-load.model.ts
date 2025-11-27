export interface AcademicLoad {
    id: number;
    teacherId: number;
    fullName: string;
    subjectId: number;
    subjectName: string;
    groupId: number;
    groupName: string;
    days: string[];
    status: number;
}
export interface CreateModelAcademicLoad{
    id: number;
    status: number;
    teacherId: number;
    subjectId: number;
    groupId: number;
    days: number;
}

export interface horarioDay {

    teacherId: number;
    fullName: string;
    subjectId: number;
    subjectName: string;
    groupId: number;
    groupName: string;
    countStudents: number;
    id: number;
    status: number;

}
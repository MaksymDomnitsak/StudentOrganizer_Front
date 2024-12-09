import { StudentWithoutGroup } from "./studentWithoutGroup";

export interface GroupWithStudents{
    id: number;
    name: string;
    students: StudentWithoutGroup[];
}
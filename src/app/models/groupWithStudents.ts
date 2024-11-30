import { Student } from "./student";

export interface GroupWithStudents{
    id: number;
    name: string;
    students: Student[];
}
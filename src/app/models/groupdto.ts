import { Student } from "./student";

export interface GroupDto{
    id: number;
    name: string;
    students: Student[];
    disabled: boolean;
}
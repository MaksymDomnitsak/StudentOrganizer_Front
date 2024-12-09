import { Schedule } from "./schedule";
import { Student } from "./student";

export class GroupNote{
    title: string = "";
    schedule: number;
    students: number[] = [];
    body: string = "";

    constructor(title: string = "", eventId: number = 0, students: number[], body: string = ""){
        this.title = title;
        this.schedule = eventId;
        this.students = students;
        this.body = body;
    }
}
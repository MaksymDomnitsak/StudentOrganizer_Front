import { Group } from "./group";
import { TeacherDTO } from "./shortenedteacher";
import { Subject } from "./subject";
import { User } from "./user";

export interface Schedule {
    id: number;
    subject: Subject;
    teacher: TeacherDTO;
    group: Group;
    dayOfWeek: number;
    evenWeek: boolean;
    lessonOrder: number;
    typeOfLesson: string;
    online: boolean;
    auditoryNumber: string;

  }
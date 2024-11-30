import { Time } from "@angular/common";
import { Group } from "./group";
import { Subject } from "./subject";
import { User } from "./user";

export interface ScheduleWithTime {
    id: number;
    title: string;
    startTime: Time;
    endTime: Time;
    subject: Subject;
    creator: User;
    attendees: User[]; 
    online: boolean;
    auditoryNumber: string;

  }
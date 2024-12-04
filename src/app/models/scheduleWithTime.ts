import { Time } from "@angular/common";
import { Subject } from "./subject";
import { User } from "./user";

export interface EventCustom {
    id: number;
    title: string;
    startTime: Date;
    endTime: Date;
    subject: Subject;
    creator: User;
    attendees: User[]; 
    isOnline: boolean;
    auditoryNumber: string;

  }
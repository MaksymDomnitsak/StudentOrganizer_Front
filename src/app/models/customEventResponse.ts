export class CustomEventResponse {
    id: number;
    title: string;
    startTime: Date;
    endTime: Date;
    subject?: number;
    creator: number;
    attendees: number[]; 
    isOnline: boolean;
    auditoryNumber: string;

        constructor(id: number,title: string, subjectid: number, creatorid: number, attendees: number[],
            online: boolean, auditoryNumber: string = "", startTime: Date, endTime: Date){
                this.id = id;
                this.title = title;
                this.subject = subjectid;
                this.creator = creatorid;
                this.attendees = attendees;
                this.isOnline = online;
                this.auditoryNumber = auditoryNumber;
                this.startTime = startTime;
                this.endTime = endTime;
            }
  }
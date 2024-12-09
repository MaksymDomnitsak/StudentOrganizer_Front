export class ScheduleGoogleCalendar{
    summary: string = "";
    location: string = "";
    description: string = "";
    startDate: string = "";
    frequency: string = "";
    repeats: string = "";
    attendeesEmails: string[] = [];
    conference: string = "";
    startTime: string = "";
    endTime: string = "";
    scheduleId: number = 0;

    constructor(summary: string = "",
    description: string = "",
    location: string = "",
    startDate: string = "",
    frequency: string = "",
    repeats: string = "",
    attendees: string[] = [],
    conference: string = "",
    startTime: string = "",
    endTime: string = "",
    scheduleId: number = 0){
        this.summary=summary;
        this.description=description;
        this.location=location;
        this.startDate=startDate;
        this.frequency=frequency;
        this.repeats=repeats;
        this.attendeesEmails=attendees;
        this.conference=conference;
        this.startTime=startTime;
        this.endTime=endTime;
        this.scheduleId=scheduleId;
    }
}
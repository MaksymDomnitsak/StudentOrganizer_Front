export class EventGoogleCalendar{
    summary: string = "";
    location: string = "";
    description: string = "";
    frequency: string = "";
    repeats: string = "";
    attendeesEmails: string[] = [];
    conference: string = "";
    startDateTime: Date;
    endDateTime: Date;
    eventId: number = 0;

    constructor(summary: string = "",
    description: string = "",
    location: string = "",
    frequency: string = "",
    repeats: string = "",
    attendees: string[] = [],
    conference: string = "",
    startDateTime: Date,
    endDateTime: Date,
    eventId: number = 0){
        this.summary=summary;
        this.description=description;
        this.location=location;
        this.frequency=frequency;
        this.repeats=repeats;
        this.attendeesEmails=attendees;
        this.conference=conference;
        this.startDateTime=startDateTime;
        this.endDateTime=endDateTime;
        this.eventId=eventId;
    }
}
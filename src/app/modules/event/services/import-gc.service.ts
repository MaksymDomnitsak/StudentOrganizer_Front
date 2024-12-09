import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventGoogleCalendar } from 'src/app/models/eventGoogleCalendar';
import { ScheduleGoogleCalendar } from 'src/app/models/scheduleGoogleCalendar';

@Injectable({
  providedIn: 'root'
})
export class ImportGCService {

  constructor(private http: HttpClient) {}

  importToGC(eventForm: ScheduleGoogleCalendar){
    const url = "/api/googleschedule/api/calendar/createSchedule"
    return this.http.post(url,eventForm,{reportProgress: true,withCredentials:true}).subscribe();
  }

  importEventToGC(eventForm:EventGoogleCalendar){
    const url = "/api/googleschedule/api/calendar/createEvent"
    return this.http.post(url,eventForm,{reportProgress: true,withCredentials:true}).subscribe();
  }
  }


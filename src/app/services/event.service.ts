import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventCustom } from '../models/scheduleWithTime';
import { CustomEventResponse } from '../models/customEventResponse';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  PROXY_URL: string = "/api/events";
  events:EventCustom[] = [];
  constructor(private http:HttpClient) { }


  getAllEvents(){
    this.events = [];
    this.http.get<EventCustom[]>(this.PROXY_URL).subscribe((response: EventCustom[]) => {response.forEach((item)=>this.events.push(item));});
    return this.events;
  }

  getById(id: number){
    return this.http.get<EventCustom>(this.PROXY_URL+"/"+id);
  }

  getEventsByCreatorId(id: number){
    this.events = [];
    this.http.get<EventCustom[]>(this.PROXY_URL+"/creator?creatorId="+id).subscribe((response: EventCustom[]) => {response.forEach((item)=>this.events.push(item));});
    console.log(this.events);
    return this.events;
  }

  getEventsByAttendeeId(id: number){
    this.events = [];
    this.http.get<EventCustom[]>(this.PROXY_URL+"/attendee?attendeeId="+id).subscribe((response: EventCustom[]) => {response.forEach((item)=>this.events.push(item));});
    return this.events;
  }

  deleteEvent(id: number){
    const url = "/api/events/"+id;
    return this.http.delete<EventCustom[]>(url);
  }

  createEvent(event: CustomEventResponse){
    return this.http.post<EventCustom>(this.PROXY_URL,event);
  }

  updateEvent(id: number, event: CustomEventResponse){
    return this.http.put<EventCustom>(this.PROXY_URL+"/"+id, event);
  }
}

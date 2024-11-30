import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Schedule } from '../models/schedule';
import { map,tap } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { ScheduleWithTime } from '../models/scheduleWithTime';
import { CustomEventResponse } from '../models/customEventResponse';
import { EventsPage } from '../models/eventsPage';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  schedule:Schedule[] = [];
  PROXY_URL: string = "/api/scheduleteachsubj";
  constructor(private http: HttpClient) {}

  getById(eventId: number){
    const url = "/api/schedule/";
    return this.http.get<Schedule>(this.PROXY_URL+url+eventId);
  }

  getSchedulebyGroup(groupId: string) {
    this.schedule = [];
    const url = "/api/schedule?groupId=";
    this.http.get<Schedule[]>(this.PROXY_URL+url+groupId).subscribe((response: Schedule[]) => {response.forEach((item)=>this.schedule.push(item));});
    return this.schedule;
  }

  getSchedulebyTeacher(teacherId: number) {
    this.schedule = [];
    const url = "/api/schedule?teacherId=";
    this.http.get<Schedule[]>(this.PROXY_URL+url+teacherId).subscribe((response: Schedule[]) => {response.forEach((item)=>this.schedule.push(item));});
    return this.schedule;
  }

 getSchedule(){
    this.schedule = [];
    const url = "/api/schedule";
    this.http.get<Schedule[]>(this.PROXY_URL+url).subscribe((response: Schedule[]) => {response.forEach((item)=>this.schedule.push(item));});
    
    return this.schedule;
  }

  getPageScheduleByTeacherId(page: number, size: number, teacherId: number){
    this.schedule = [];
    const url = "/api/schedule?page="+page+"&size="+size+"&teacherId="+teacherId;
    return this.http.get<EventsPage>(this.PROXY_URL+url);
  }
}
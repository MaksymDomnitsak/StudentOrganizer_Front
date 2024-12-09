import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Schedule } from '../models/schedule';
import { EventsPage } from '../models/eventsPage';
import { GroupDto } from '../models/groupdto';

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
    console.log(groupId)
    this.http.get<Schedule[]>(this.PROXY_URL+url+groupId).subscribe((response: Schedule[]) => {response.forEach((item)=>this.schedule.push(item));});
    console.log(this.schedule)
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

  getGroupsFromScheduleByTeacherId(id: number){
    const url = "/api/schedule/getGroups?teacherId="+id;
    return this.http.get<GroupDto[]>(this.PROXY_URL+url);
  }
}
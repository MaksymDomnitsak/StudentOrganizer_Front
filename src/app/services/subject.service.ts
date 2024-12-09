import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  PROXY_URL: string = "/api/scheduleteachsubj";

  constructor(private http: HttpClient) { }

  getSubjectsByTeacherId(teacherId: number) {
    const url = this.PROXY_URL+"/api/schedule/getSubjects?teacherId="+teacherId;
    return this.http.get<Subject[]>(url);
  }
}

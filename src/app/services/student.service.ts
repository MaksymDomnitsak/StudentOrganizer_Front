import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }
  PROXY_URL = "/api/studgroups";
  getStudents() {
    const url = "/api/students";
    return this.http.get<Student[]>(this.PROXY_URL+url);
  }
}

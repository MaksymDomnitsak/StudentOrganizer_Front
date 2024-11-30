import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = '/api/scheduleteachsubj';

  constructor(private http: HttpClient) {}

  loadAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}/api/teachers`);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/teachers/${id}`);
  }

  getTeachers() {
    const url = `${this.apiUrl}/api/teachers`;
    return this.http.get<Teacher[]>(url);
  }
}

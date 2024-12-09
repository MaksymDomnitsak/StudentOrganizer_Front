import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { Observable } from 'rxjs';
import { GroupWithStudents } from '../models/groupWithStudents';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  

  constructor(private http: HttpClient) { }

  getGroupsEnabled() {
    const url = "/api/studgroups/api/groups/enabled";
    return this.http.get<Group[]>(url);
  }

  getGroupsWithStudents() {
    const url = "/api/studgroups/api/groups/withStudents";
    return this.http.get<GroupWithStudents[]>(url);
  }

  getGroups() {
    const url = "/api/studgroups/api/groups";
    return this.http.get<Group[]>(url);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`/api/studgroups/api/groups/${id}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { Subject } from 'src/app/models/subject';
import { User } from 'src/app/models/user';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { SubjectService } from 'src/app/services/subject.service';
import { CustomEventResponse } from 'src/app/models/customEventResponse';
import { ExtraUtils } from 'src/app/services/utils';
import { atLeastOneValidator } from 'src/app/formvalidators/atLeastOneValidator';
import { GroupWithStudents } from 'src/app/models/groupWithStudents';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  eventForm!: FormGroup;
  subjects: Subject[] = []; 
  attendees: User[] = []; 
  groups: GroupWithStudents[] = []; 
  daysOfWeek = EXTRA_ARRAYS.weekdays;

  constructor(private formBuilder: FormBuilder,private groupService:GroupService, private eventService:EventService, private authService:AuthService,
    private userService:UserService,private router:Router, private subjectService: SubjectService, private utils:ExtraUtils) {
      this.subjectService.getSubjectsByTeacherId(this.authService.userProfile.value.userId).subscribe((data: Subject[]) => data.forEach((item) => this.subjects.push(item)))
      this.groupService.getGroupsWithStudents().subscribe((data: GroupWithStudents[]) => data.forEach((item) => this.groups.push(item)));
      this.userService.getUsers().subscribe((data: User[]) => data.forEach((item) => this.attendees.push(item)));
   }

  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      subjects: [0],
      attendees: [[]],
      groups: [[]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      eventMode: ['online'],
      roomNumber: ['']});
  }

  createEvent() {
    let isOnline: boolean = this.eventForm.get("eventMode")?.value == 'online' ? true : false;
    const grps: number[] = this.eventForm.get('groups')?.value;
    const selectedIDs: number[] = [];
    this.groups.filter(group => grps.includes(group.id)) 
    .forEach(group => {
    const ids = group.students.map(student => student.id); 
    selectedIDs.push(...ids); 
    });
    const attendees: number[] = this.eventForm.get('attendees')?.value || [];
    selectedIDs.push(...attendees);
    let event = new CustomEventResponse(0,this.eventForm.get("title")?.value,this.eventForm.get("subjects")?.value,this.authService.userProfile.value.userId, 
    selectedIDs, isOnline,this.eventForm.get("roomNumber")?.value, this.eventForm.get("startTime")?.value,this.eventForm.get("endTime")?.value);

    this.eventService.createEvent(event).subscribe(() => {
      this.router.navigateByUrl('/event-page');
    });
  }

}
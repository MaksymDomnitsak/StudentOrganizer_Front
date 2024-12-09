import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/models/note';
import { ScheduleService } from 'src/app/services/schedule.service';
import { AuthService } from '../../auth/services/auth.service';
import { EventCustom } from 'src/app/models/scheduleWithTime';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { Subject } from 'src/app/models/subject';
import { SubjectService } from 'src/app/services/subject.service';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { CustomEventResponse } from 'src/app/models/customEventResponse';
import { ExtraUtils } from 'src/app/services/utils';
import { Schedule } from 'src/app/models/schedule';
import { EventService } from 'src/app/services/event.service';
import { GroupWithStudents } from 'src/app/models/groupWithStudents';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent {
  eventForm!: FormGroup;
  subjects: Subject[] = []; 
  attendee: User[] = []; 
  groups: GroupWithStudents[] = []; 
  userIds: number[] = [];
  eventId: number = 0;
  daysOfWeek = EXTRA_ARRAYS.weekdays;
  
  constructor(private formBuilder: FormBuilder,private eventService:EventService,private router: Router,
    private authService:AuthService,private activateRoute: ActivatedRoute, private subjectService: SubjectService,
    private groupService:GroupService,private userService:UserService, private utils:ExtraUtils)
  {    
    this.subjectService.getSubjectsByTeacherId(this.authService.userProfile.value.userId).subscribe((data: Subject[]) => data.forEach((item) => this.subjects.push(item)))
    this.groupService.getGroupsWithStudents().subscribe((data: GroupWithStudents[]) => data.forEach((item) => this.groups.push(item)));
    this.userService.getUsers().subscribe((data: User[]) => data.forEach((item) => this.attendee.push(item)));
    this.eventService.getById(activateRoute.snapshot.params['id']).subscribe((data: EventCustom) => {this.setFormValues(data);});
  
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

  setFormValues(data: EventCustom){
    this.eventId = data.id;
    if(data.subject != null && data.subject != undefined) this.eventForm.get('subjects')?.setValue(data.subject.id);
    this.eventForm.get('title')?.setValue(data.title);
    this.eventForm.get('startTime')?.setValue(data.startTime);
    this.eventForm.get('endTime')?.setValue(data.endTime);
    if(data.isOnline == false) {
      this.eventForm.get('eventMode')?.setValue('offline');
      this.eventForm.get('roomNumber')?.setValue(data.auditoryNumber);
    }
    const userIds = data.attendees.map((user) => user.id);
    this.eventForm.get('attendees')?.setValue(userIds);
    }

    updateEvent() {
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
      const uniqueEmails = Array.from(new Set(selectedIDs));
      let event = new CustomEventResponse(this.eventId,this.eventForm.get("title")?.value,this.eventForm.get("subjects")?.value,this.authService.userProfile.value.userId, 
      uniqueEmails, isOnline,this.eventForm.get("roomNumber")?.value, this.eventForm.get("startTime")?.value,this.eventForm.get("endTime")?.value);
  
      this.eventService.updateEvent(this.eventId,event).subscribe(() => {
        this.router.navigateByUrl('/event-page');
      });
      
  
    }
  }

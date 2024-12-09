import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupWithStudents } from 'src/app/models/groupWithStudents';
import { EventCustom } from 'src/app/models/scheduleWithTime';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ImportGCService } from '../services/import-gc.service';
import { GroupService } from 'src/app/services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtraUtils } from 'src/app/services/utils';
import { EventService } from 'src/app/services/event.service';
import { EventGoogleCalendar } from 'src/app/models/eventGoogleCalendar';

@Component({
  selector: 'app-import-event-to-gc',
  templateUrl: './import-event-to-gc.component.html',
  styleUrls: ['./import-event-to-gc.component.css']
})
export class ImportEventToGCComponent {
  eventForm!: FormGroup;

  repeatOptions = Array.from({ length: 14 }, (_, i) => 2 + i);
  groupOptions : GroupWithStudents[] = [];
  attendeeOptions : User[] = [];
  event! : EventCustom;
  touched:boolean = false;


  constructor(private formBuilder: FormBuilder,private groupService:GroupService, private eventService:EventService, private router:Router,
     private userService:UserService, private importService:ImportGCService,private activateRoute: ActivatedRoute, private utils:ExtraUtils) {
      this.eventForm = this.formBuilder.group({
        summary: [ '', Validators.required],
        location: [''],
        description: ['', Validators.required],
        frequency: ['weekly', Validators.required],
        repeats: ['1', Validators.required],
        groups: [[]],
        attendees: [[]],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        conference: ['none']
      });
      this.eventService.getById(this.activateRoute.snapshot.params['id']).subscribe((data: EventCustom) => {this.summaryCheck(data);});
      this.groupService.getGroupsWithStudents().subscribe((data: GroupWithStudents[]) => data.forEach((item) => this.groupOptions.push(item)));
      this.userService.getUsers().subscribe((data: User[]) => data.forEach((item) => this.attendeeOptions.push(item)));
     }

  importEvent(){
    const grps: string[] = this.eventForm.get('groups')?.value;
    const selectedEmails: string[] = [];
    this.groupOptions.filter(group => grps.includes(group.name)) 
    .forEach(group => {
    const emails = group.students.map(student => student.email); 
    selectedEmails.push(...emails); 
    });
    const attendees: string[] = this.eventForm.get('attendees')?.value || [];
    selectedEmails.push(...attendees);
    const uniqueEmails = Array.from(new Set(selectedEmails));
    const event = new EventGoogleCalendar(this.eventForm.get('summary')?.value,this.eventForm.get('description')?.value,this.eventForm.get('location')?.value,
     this.eventForm.get('frequency')!.value,this.eventForm.get('repeats')!.value,uniqueEmails
    ,this.eventForm.get('conference')!.value,this.eventForm.get('startTime')!.value,this.eventForm.get('endTime')!.value
   , this.event.id);
    this.importService.importEventToGC(event);
    this.router.navigate(['/event-page']);
  }

  summaryCheck(data: EventCustom){
    this.event=data;
    var summary = this.event.title;
    if(this.event.subject != null && this.event.subject != undefined) summary+=". "+this.event.subject.name
    const emails = this.event.attendees.map(attendee => attendee.email)
    this.eventForm.get('summary')?.setValue(summary);
    this.eventForm.get('attendees')?.setValue(emails);
    this.eventForm.get('location')?.setValue( this.event.isOnline == false ? this.event.auditoryNumber : "Онлайн");
    this.eventForm.get('startTime')?.setValue(this.event.startTime);
    this.eventForm.get('endTime')?.setValue(this.event.endTime);

  }
}

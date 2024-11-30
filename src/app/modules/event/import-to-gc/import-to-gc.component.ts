import { AfterViewChecked, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { UserService } from 'src/app/services/user.service';
import { ImportGCService } from '../services/import-gc.service';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleWithTime } from 'src/app/models/scheduleWithTime';
import { EventGoogleCalendar } from 'src/app/models/eventGoogleCalendar';
import { AuthService } from '../../auth/services/auth.service';
import { GroupWithStudents } from 'src/app/models/groupWithStudents';
import { Schedule } from 'src/app/models/schedule';
import { ExtraUtils } from 'src/app/services/utils';

@Component({
  selector: 'app-import-to-gc',
  templateUrl: './import-to-gc.component.html',
  styleUrls: ['./import-to-gc.component.css']
})
export class ImportToGCComponent {
  eventForm!: FormGroup;

  repeatOptions = Array.from({ length: 14 }, (_, i) => 2 + i);
  groupOptions : GroupWithStudents[] = [];
  attendeeOptions : User[] = [];
  scheduleWithTime! : Schedule;
  touched:boolean = false;


  constructor(private formBuilder: FormBuilder,private groupService:GroupService, private scheduleService: ScheduleService, private router:Router,
     private userService:UserService, private importService:ImportGCService,private activateRoute: ActivatedRoute, private utils:ExtraUtils) {
      this.eventForm = this.formBuilder.group({
        summary: [ "", Validators.required],
        location: [''],
        description: ['', Validators.required],
        startDate: ['', Validators.required],
        frequency: ['weekly', Validators.required],
        repeats: ['1', Validators.required],
        groups: [[]],
        attendees: [[]],
        conference: ['none']
      });
      this.scheduleService.getById(this.activateRoute.snapshot.params['id']).subscribe((data: Schedule) => {this.summaryCheck(data);});
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
    const summary = this.scheduleWithTime.subject.name + " (" + grps.join(", ") + ")";
    const uniqueEmails = Array.from(new Set(selectedEmails));
    const event = new EventGoogleCalendar(summary,this.eventForm.get('description')?.value,this.eventForm.get('location')?.value,
    this.eventForm.get('startDate')!.value, this.eventForm.get('frequency')!.value,this.eventForm.get('repeats')!.value,uniqueEmails
    ,this.eventForm.get('conference')!.value,this.utils.startTimeFromNumber(this.scheduleWithTime.lessonOrder)
    ,this.utils.endTimeFromNumber(this.scheduleWithTime.lessonOrder), this.scheduleWithTime.id);
    this.importService.importToGC(event);
    this.router.navigate(['/event-page']);
  }

  summaryCheck(data: Schedule){
    this.scheduleWithTime=data;
    this.eventForm.get('summary')?.setValue(this.scheduleWithTime.subject.name);
    this.eventForm.get('groups')?.setValue([this.scheduleWithTime.group.id, ]);
    
  //}

  }
}

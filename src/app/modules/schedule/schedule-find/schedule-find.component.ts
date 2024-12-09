import { ChangeDetectorRef, Component, Input, AfterContentChecked } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { AuthService } from '../../auth/services/auth.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Group } from 'src/app/models/group';
import { Teacher } from 'src/app/models/teacher';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Schedule } from 'src/app/models/schedule';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { User } from 'src/app/models/user';
import { ScheduleFindFormDataService } from '../services/schedule-find-form-data-service.service';
import { ExtraUtils } from 'src/app/services/utils';
import { EventsPage } from 'src/app/models/eventsPage';

@Component({
  selector: 'app-schedule-find',
  templateUrl: './schedule-find.component.html',
  styleUrls: ['./schedule-find.component.css']
})
export class ScheduleFindComponent {
  groupList: Group[] = [];
  teacherList: Teacher[] = [];
  weekdays = EXTRA_ARRAYS.weekdays;
  teacherTitle!: string;
  schdlConverter: ScheduleFindFormDataService;
  utils: ExtraUtils;
  allSchedule: boolean = true;
  groupIds: number[] = [];
  findSchedule!: FormGroup;

  constructor(private service: AuthService, 
    private teacherService: TeacherService, 
    private groupService: GroupService, 
    private scheduleService: ScheduleService, 
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    utils:ExtraUtils,
    schdlConverter: ScheduleFindFormDataService){
      this.schdlConverter = schdlConverter;
      this.utils = utils;
      this.groupService.getGroupsEnabled().subscribe((data: Group[]) => {data.forEach((item) => {
        if(item.name != "-"){
        this.groupList.push(item)
        }
      });});
      this.teacherService.getTeachers().subscribe((data: Teacher[]) => data.forEach((item) => this.teacherList.push(item)));
      this.groupService.getGroupsEnabled().subscribe((data: Group[]) => {data.forEach((item) => {
        this.groupIds.push(item.id)
      });});
      this.groupList
  }

  ngOnInit(){
    this.findSchedule = this.formBuilder.group({
      teacherSelect: [''],
      groupSelect: [0]
    });
    
    this.getAllSchedule();
    this.findSchedule.get('teacherSelect')!.valueChanges.subscribe(value => {
      if (value) {
        this.findSchedule.get('groupSelect')!.reset();
        this.findSchedule.get('groupSelect')!.setValue(0);
        
      }
    });

    this.findSchedule.get('groupSelect')!.valueChanges.subscribe(value => {
      if (value) {
        this.findSchedule.get('teacherSelect')!.reset();
        this.findSchedule.get('teacherSelect')!.setValue("");
      }
    });
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detach();
    this.changeDetector.detectChanges();
   }

  ngAfterViewChecked(): void {
    this.schdlConverter.schIt = 0;
  }

  getScheduleByTeacherOrGroup(){
    this.allSchedule = false;
    if(this.findSchedule.get('groupSelect')!.value !== 0){
      var value = this.findSchedule.get('groupSelect')!.value
      this.schdlConverter.schedule = this.scheduleService.getSchedulebyGroup(value.toString());
    }
      else if(this.findSchedule.get('teacherSelect')!.value !== ''){
        this.schdlConverter.schedule=this.scheduleService.getSchedulebyTeacher(this.findSchedule.get('teacherSelect')!.value);
        
      }else{
        this.scheduleService.getSchedule();
        this.schdlConverter.schedule = this.scheduleService.schedule;
  }
}

  getAllSchedule(){
    this.allSchedule = true;
    this.scheduleService.getSchedule();
    this.schdlConverter.schedule = this.scheduleService.schedule;
    console.log(this.schdlConverter.schedule)
    if(this.findSchedule.get('groupSelect')!.value !== 0 || this.findSchedule.get('teacherSelect')!.value !== ''){
      this.findSchedule.reset();
      this.findSchedule.get('teacherSelect')!.setValue("");
      this.findSchedule.get('groupSelect')!.setValue(0);
    }
    this.changeDetector.detectChanges();

  }

  readTeacherName(teacher: Teacher){
    return teacher.lastName+" "+teacher.firstName+" "+teacher.patronymicName;
  }

  readUserName(creator: User){
    this.teacherTitle = creator.lastName+" "+creator.firstName+" "+creator.patronymicName;
  }

  checkAndOutput(dayOfWeek: number,evenWeek:boolean,lessonOrder:number,outputType: string){
    this.schdlConverter.checkAndOutput(dayOfWeek,evenWeek,lessonOrder,outputType);
  }

  checkFacultySchedule(dayOfWeek: number,evenWeek:boolean,lessonOrder:number,groupId: number){
    this.schdlConverter.checkFacultySchedule(dayOfWeek,evenWeek,lessonOrder,groupId);
   }

   readGroupName(id:number){
    return this.groupList.find((g) => g.id === id)?.name;
   }

}

import { AfterContentChecked, ChangeDetectorRef, Component,OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScheduleWithTime } from 'src/app/models/scheduleWithTime';
import { AuthService } from '../../auth/services/auth.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Router } from '@angular/router';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { User } from 'src/app/models/user';
import { ExtraUtils } from 'src/app/services/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Schedule } from 'src/app/models/schedule';
import { MakeReportService } from '../services/make-report.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements AfterContentChecked {
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;

  eventForDelete: ScheduleWithTime | undefined;
  indexForDelete!: number;
  userRole!: string;

  activeTab = "tab1";
  utils:ExtraUtils;
  schedule: Schedule[] = [];
  subjectName: String = "";
  groupName: String = "";
  creatorName: String = "";
  dayOfWeek: String = "";
  time: String = "";
  typeOfEvent: String = "";
  attendees: String = "";
  auditory: String = "";

  isModalOpen: boolean = false;
  checkbox1: boolean = false;
  checkbox2: boolean = false;

  constructor(private modalService: NgbModal,private service: AuthService, private scheduleService: ScheduleService, private reportService: MakeReportService, private router: Router
    ,utils:ExtraUtils,private cdr: ChangeDetectorRef){
    this.utils=utils;
    
  }

  ngOnInit(){
    this.userRole = localStorage.getItem("role")!.toString();
    this.schedule = this.scheduleService.getSchedulebyTeacher(this.service.userProfile.value.userId);
  }

  changeTab(tab:string){
    this.activeTab=tab;
    if(tab == "tab1") this.scheduleService.getSchedulebyTeacher(this.service.userProfile.value.userId);
    /*this.schedule = tab === "tab1" ? this.scheduleService.getScheduleWithTimebyCreator(this.service.userProfile.value.userId) :
      this.scheduleService.getScheduleByAttendee(this.service.userProfile.value.email);*/
  }

  setValues(event:Schedule){
    this.subjectName = event.subject.name;
    this.groupName = event.group.name;
    this.dayOfWeek = EXTRA_ARRAYS.weekdays[event.dayOfWeek-1];
    this.time = this.chooseLessonOrder(event.lessonOrder);
    this.typeOfEvent = event.typeOfLesson;
    this.attendees = "-";
    this.auditory = !event.online ? event.auditoryNumber : "Онлайн";
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
    this.cdr.detach();
    this.cdr.detectChanges();
   }

  openConfirmDeleteModal(event:ScheduleWithTime,index:number) {
    this.eventForDelete = event;
    this.indexForDelete = index;
    this.modalService.open(this.confirmDeleteModal);
  }

  onDeleteConfirmed() {
    this.schedule.splice(this.indexForDelete,1);
    this.modalService.dismissAll(this.confirmDeleteModal);
    /*this.scheduleService.deleteCustomEvent(this.eventForDelete!.id).subscribe(() => {
      this.router.navigate(['/teachersPage']);
    });*/
    

  }

  cancelModal(){
    this.eventForDelete = undefined;
    this.indexForDelete = -1;
    this.modalService.dismissAll(this.confirmDeleteModal);
  }

  isDisabled(event: Schedule){
    return ((event.typeOfLesson == 'LECTURE') || (event.typeOfLesson == 'PRACTICAL') || (event.typeOfLesson == 'LABORATORY'));
  }

  chooseLessonOrder(num: number){
    switch(num){
      case 1: return "8:20-9:40";
      case 2: return "9:50-11:10";
      case 3: return "11:30-12:50";
      case 4: return "13:00-14:20";
      case 5: return "14:40-16:00";
      case 6: return "16:10-17:30";
      default:{
        return "Wrong lesson order";
      }
    }
  }
}

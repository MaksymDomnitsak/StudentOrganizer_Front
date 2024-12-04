import { AfterContentChecked, ChangeDetectorRef, Component,OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EventCustom} from 'src/app/models/scheduleWithTime';
import { AuthService } from '../../auth/services/auth.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Router } from '@angular/router';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { User } from 'src/app/models/user';
import { ExtraUtils } from 'src/app/services/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Schedule } from 'src/app/models/schedule';
import { MakeReportService } from '../services/make-report.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements AfterContentChecked {
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;

  eventForDelete: EventCustom | undefined;
  indexForDelete!: number;
  userRole!: string;

  activeTab = "tab2";
  utils:ExtraUtils;
  schedule: Schedule[] = [];
  events: EventCustom[] = [];
  subjectName: String = "";
  groupName: String = "";
  creatorName: String = "";
  dayOfWeek: String = "";
  time: String = "";
  typeOfEvent: String = "";
  attendees: String = "";
  auditory: String = "";
  startTime: string = "";
  endTime: string = "";
  title: String = "";

  isModalOpen: boolean = false;
  checkbox1: boolean = false;
  checkbox2: boolean = false;

  constructor(private modalService: NgbModal,private service: AuthService, private scheduleService: ScheduleService,private eventService: EventService, private router: Router
    ,utils:ExtraUtils,private cdr: ChangeDetectorRef){
    this.utils=utils;
    
  }

  ngOnInit(){
    this.userRole = localStorage.getItem("role")!.toString();
    this.schedule = this.scheduleService.getSchedulebyTeacher(this.service.userProfile.value.userId);
    this.events = this.eventService.getEventsByCreatorId(this.service.userProfile.value.userId);
  }

  changeTab(tab:string){
    this.activeTab=tab;
    if(tab == "tab1") this.schedule = this.scheduleService.getSchedulebyTeacher(this.service.userProfile.value.userId);
    else if(tab == "tab2") this.events = this.eventService.getEventsByCreatorId(this.service.userProfile.value.userId);
      else this.events = this.eventService.getEventsByAttendeeId(this.service.userProfile.value.userId);
  }

  setValues(event:Schedule){
    this.subjectName = event.subject.name;
    this.groupName = event.group.name;
    var week = "";
    if(event.evenWeek == true){
      week = " по парному тижню"
    }else week = " по непарному тижню"
    this.dayOfWeek = EXTRA_ARRAYS.weekdays[event.dayOfWeek-1] + week;
    this.time = this.chooseLessonOrder(event.lessonOrder);
    this.typeOfEvent = event.typeOfLesson;
    this.attendees = "-";
    this.auditory = !event.online ? event.auditoryNumber : "Онлайн";
  }

  setValuesOfCustom(event:EventCustom){
    this.subjectName = event.subject == null ? "-" : event.subject.name;
    this.startTime = event.startTime.toLocaleString().replace("T"," ");
    this.endTime = event.endTime.toLocaleString().replace("T"," ");
    this.auditory = !event.isOnline ? event.auditoryNumber : "Онлайн";
    this.title = event.title;
  }
  
  setValuesOfAttendees(event:EventCustom){
    this.subjectName = event.subject == null ? "-" : event.subject.name;
    this.startTime = event.startTime.toLocaleString().replace("T"," ");
    this.endTime = event.endTime.toLocaleString().replace("T"," ");
    this.auditory = !event.isOnline ? event.auditoryNumber : "Онлайн";
    this.title = event.title;
    this.creatorName = event.creator.lastName + " " + event.creator.firstName
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
    this.cdr.detach();
    this.cdr.detectChanges();
   }

  openConfirmDeleteModal(event:EventCustom,index:number) {
    this.eventForDelete = event;
    this.indexForDelete = index;
    this.modalService.open(this.confirmDeleteModal);
  }

  onDeleteConfirmed() {
    this.schedule.splice(this.indexForDelete,1);
    this.modalService.dismissAll(this.confirmDeleteModal);
    this.eventService.deleteEvent(this.eventForDelete!.id).subscribe(() => {
      this.router.navigate(['/teachersPage']);
    });
    

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

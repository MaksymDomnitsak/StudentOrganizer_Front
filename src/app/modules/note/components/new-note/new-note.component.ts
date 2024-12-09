import { Component, Input } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { NoteService } from '../../services/note.service';
import { Event, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Schedule } from 'src/app/models/schedule';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { EventCustom } from 'src/app/models/scheduleWithTime';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.css']
})
export class NewNoteComponent {
  title: string = '';
  body: string = '';
  lessonId: number = 0;
  isFinished:boolean = false;

  scheduleList:EventCustom[] = [];

  daysList = EXTRA_ARRAYS.weekdays;

    constructor(private scheduleService:ScheduleService,private noteService:NoteService,private router: Router,private authService:AuthService)
    {    
      //this.scheduleList=scheduleService.getScheduleWithTimebyGroup(authService.loadUserFromLocalStorage().groupId);
    }

    readLesson(lesson:EventCustom){
      // return lesson.subject.name+", "+this.daysList[lesson.dayOfWeek-1].toString()+", "+lesson.typeOfLesson;
    }
    
    writeToDB(){
      if(this.title!="" && this.body != "" && this.lessonId != 0){
        this.noteService.writeNote(this.title,this.body,this.lessonId,this.isFinished,this.authService.userProfile.value.userId).subscribe(()=> {
          this.router.navigateByUrl('/note');
        });
      }
    }
}

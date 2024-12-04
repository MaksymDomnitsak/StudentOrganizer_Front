import { group } from '@angular/animations';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Schedule } from 'src/app/models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFindFormDataService {

  lesInfo = "";
  subject = "";
  typeAud = "";
  groupList = "";
  schIt = 0;
  schedule: Schedule[] = [];

   checkAndOutput(dayOfWeek: number,evenWeek:boolean,lessonOrder:number,outputType: string){
     if(outputType == "Group"){
       if(this.schedule.length == 0){
         return;
       }
       
       if(this.schIt==this.schedule.length){;
         this.schIt--;
       }
       if(this.schedule[this.schIt].dayOfWeek==dayOfWeek && this.schedule[this.schIt].evenWeek==evenWeek && this.schedule[this.schIt].lessonOrder==lessonOrder){
         this.lesInfo=this.schedule[this.schIt].teacher.lastName+" "+this.schedule[this.schIt].teacher.firstName+" "
         +this.schedule[this.schIt].teacher.patronymicName;
         this.subject=this.schedule[this.schIt].subject.name;
         this.typeAud =" ("+this.schedule[this.schIt].typeOfLesson.normalize()+", ";
          if(this.schedule[this.schIt].online==false){
        this.typeAud+=this.schedule[this.schIt].auditoryNumber+")"
          }else this.typeAud+= "Онлайн)";
         this.schIt++;
         
         return;
       }else{
         this.lesInfo=" ";
         this.subject=" "
         this.typeAud=" ";
         this.groupList=" ";
       }
     }else{
      if(this.schedule.length == 0){
        return;
      }
      
      if(this.schIt==this.schedule.length){;
        this.schIt--;
      }
      if(this.schedule[this.schIt].dayOfWeek==dayOfWeek && this.schedule[this.schIt].evenWeek==evenWeek && this.schedule[this.schIt].lessonOrder==lessonOrder){
        this.lesInfo=this.schedule[this.schIt].subject.name;
        this.typeAud =" ("+this.schedule[this.schIt].typeOfLesson.normalize()+", ";
        if(this.schedule[this.schIt].online==false){
      this.typeAud+=this.schedule[this.schIt].auditoryNumber+")"
        }else this.typeAud+= "Онлайн)";
        this.groupList="";
        while (this.schIt != this.schedule.length && this.schedule[this.schIt].dayOfWeek==dayOfWeek && this.schedule[this.schIt].evenWeek==evenWeek 
            && this.schedule[this.schIt].lessonOrder==lessonOrder ) 
            {
          this.groupList+="\t   "+this.schedule[this.schIt].group.name+ ", ";
          this.schIt++;
        }
        this.groupList=this.groupList.substring(0,this.groupList.lastIndexOf(","));
        return;
      }else{
        this.lesInfo=" ";
        this.typeAud = " ";
        this.groupList=" ";
        this.subject=" ";
      }
     }

    return;
   }

   checkFacultySchedule(dayOfWeek: number,evenWeek:boolean,lessonOrder:number,groupId: number){
    if(this.schedule.length == 0){
      return;
    }
    
    if(this.schIt==this.schedule.length){;
      this.schIt--;
    }
  
    if(this.schedule[this.schIt].dayOfWeek==dayOfWeek && this.schedule[this.schIt].evenWeek==evenWeek
       && this.schedule[this.schIt].lessonOrder==lessonOrder && this.schedule[this.schIt].group.id == groupId){
      this.lesInfo=this.schedule[this.schIt].teacher.lastName+" "+this.schedule[this.schIt].teacher.firstName+" "
      +this.schedule[this.schIt].teacher.patronymicName;
      this.subject=this.schedule[this.schIt].subject.name;
      this.typeAud =" ("+this.schedule[this.schIt].typeOfLesson.normalize()+", ";
      if(this.schedule[this.schIt].online==false){
        this.typeAud+=this.schedule[this.schIt].auditoryNumber+")";
      }else this.typeAud+= "Онлайн)";
      this.schIt++;
      
      return;
    }else{
      this.lesInfo=" ";
      this.typeAud=" ";
      this.groupList=" ";
      this.subject=" ";
    }
  }

  

   chooseLessonOrder(num: number){
    switch(num%12){
      case 1:
      case 2:{
        return 1;
      }
      case 3:
      case 4:{
        return 2;
      }
      case 5:
      case 6:{
        return 3;
      }
      case 7:
      case 8:{
        return 4;
      }
      case 9:
      case 10:{
        return 5;
      }
      case 11:
      case 0:{
        return 6;
        }
      default:{
        return 0;
      }
    }
  }
}

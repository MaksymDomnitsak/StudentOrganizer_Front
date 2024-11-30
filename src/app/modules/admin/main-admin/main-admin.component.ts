import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css']
})
export class MainAdminComponent {
  isTimerRunning$: Observable<boolean>;
  elapsedTime$: Observable<number>;
  private subscription: Subscription;
    constructor(private http:HttpClient,private timerService: TimerService,private router:Router){
      this.isTimerRunning$ = this.timerService.isTimerRunning;
      this.elapsedTime$ = this.timerService.elapsedTime;
      this.subscription = this.timerService.isTimerRunning.subscribe(isRunning => {
      });
    }

    startTimer() {
      this.timerService.startTimer();
      console.log(this.isTimerRunning$+" "+this.elapsedTime$)
    }

    stopTimer() {
      this.timerService.stopTimer();
    }

    writeGroupToDB(){
      const url = "/api/parse/loadGroups";
      this.http.get(url).subscribe(
        () => {
          this.stopTimer();
        })
      
    }
    writeToDB(){
      const url = "/api/parse/loadAll";
      this.http.get(url).subscribe(
        () => {
         this.stopTimer();
       });
    }

    writeTeachersToDB(){
      const url = "/api/scheduleteachsubj/api/teachers/load-teachers"
        this.http.get(url).subscribe({
      
          next: (response) => {
            console.log('Teachers successfully loaded to DB:', response);
      
            // Виконати навігацію після успішного виконання
            this.router.navigateByUrl('/admin/teachers');
          },
          error: (error) => {
            console.error('Failed to load teachers:', error);
            // Можливо, показати повідомлення про помилку
          }
        });
    }

    writeGroupsToDB(){
      const url = "/api/studgroups/api/groups/load-groups";
      this.http.get(url).subscribe({
      
        next: (response) => {
          console.log('Groups successfully loaded to DB:', response);
    
          this.router.navigateByUrl('/admin/groups');
        },
        error: (error) => {
          console.error('Failed to load groups:', error);
        }
      });
    }

    writeScheduleToDB(){
      const url = "/api/scheduleteachsubj/api/schedule/load-schedule";
      this.http.get(url).subscribe({
      
        next: (response) => {
          console.log('Schedule successfully loaded to DB:', response);
    
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          console.error('Failed to load groups:', error);
        }
      });
    }
}

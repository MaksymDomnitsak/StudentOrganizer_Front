import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MakeReportService } from '../services/make-report.service';
import { AuthService } from '../../auth/services/auth.service';
import { ReportDto } from 'src/app/models/report';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-form-component',
  templateUrl: './report-form-component.component.html',
  styleUrls: ['./report-form-component.component.css']
})
export class ReportFormComponentComponent {
  checkbox1: boolean = false; 
  checkbox2: boolean = false; 

  constructor(private service: MakeReportService, private auth: AuthService, private router:Router) {}

  sendRequest() {
    const params = {
      setOnline: this.checkbox1.valueOf(),
      setTopic: this.checkbox2.valueOf(),
    };
    const userJson = localStorage.getItem('user'); 
    if (userJson) {
      const user = JSON.parse(userJson); 
      const userId = user.userId;
      const rep:ReportDto = {
        teacherId: userId,
        setOnline: params.setOnline,
        setTopic: params.setTopic
      };
    const id = this.service.sendRequest(rep)
    
    this.router.navigateByUrl('/event-page');
  }
}

  resetForm() {
    this.checkbox1 = false;
    this.checkbox2 = false;
  }
}

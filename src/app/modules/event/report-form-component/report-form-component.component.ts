import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MakeReportService } from '../services/make-report.service';
import { AuthService } from '../../auth/services/auth.service';
import { ReportDto } from 'src/app/models/report';
import { Router } from '@angular/router';
import { Document } from "src/app/models/document";

@Component({
  selector: 'app-report-form-component',
  templateUrl: './report-form-component.component.html',
  styleUrls: ['./report-form-component.component.css']
})
export class ReportFormComponentComponent {
  checkbox1: boolean = false; 
  checkbox2: boolean = false; 
  isReportReady: boolean = false;
  reportUrl: string = '';

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
      this.service.sendRequest(rep).subscribe((response: Document) => {
      this.isReportReady = true;
      this.reportUrl = `https://docs.google.com/document/d/${response.documentId}`; 
  }
);
  }
}

openReport(){
  if (this.reportUrl) {
    window.open(this.reportUrl, '_blank');
    this.router.navigate(['/event-page']);
  } else {
    console.error('Report URL is not ready.');
  }
}

  resetForm() {
    this.checkbox1 = false;
    this.checkbox2 = false;
  }
}

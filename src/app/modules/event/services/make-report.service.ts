import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReportDto } from "src/app/models/report";

@Injectable({
    providedIn: 'root'
  })
  export class MakeReportService {
  
    constructor(private http: HttpClient) {}

    sendRequest(report: ReportDto) {
        var id = "";
        let req = {
            teacherId: report.teacherId,
            setOnline: report.setOnline,
            setTopic: report.setTopic
        };
        this.http.post<string>('/api/googleschedule/api/googleDocs/report',req).subscribe(
            (response: string) => {
                id = response.toString();
                console.log(response)
                window.open('https://docs.google.com/document/d/'+response, '_blank'); //response не розпізнається
            }
        );
        return id;
      }
  }
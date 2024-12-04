import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Document } from "src/app/models/document";
import { ReportDto } from "src/app/models/report";

@Injectable({
    providedIn: 'root'
  })
  export class MakeReportService {
  
    constructor(private http: HttpClient) {}

    sendRequest(report: ReportDto) {
         return this.http.post<Document>('/api/googleschedule/api/googleDocs/report',report)
      }

  }
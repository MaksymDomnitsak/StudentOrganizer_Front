import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupNote } from 'src/app/models/groupnote';
import { Note } from 'src/app/models/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  noteById: Note | undefined;

  constructor(private http: HttpClient) { }

  loadNotes(studentId: number){
    const url = "/api/notes?studentId=";
    return this.http.get<Note[]>(url+studentId);
  }

  loadAllNotes(){
    const url = "/api/notes";
    return this.http.get<Note[]>(url);
  }

  deleteNote(noteId: number){
    const url = "/api/notes/";
    return this.http.delete(url+noteId);
  }

  writeNote(title: string,body: string,lessonId: number,isFinished:boolean,userId: number){
    const url = "/api/notes/create";
    const req = { title: title, lesson_id: lessonId,student_id: userId,body: body, isFinished: false};
    return this.http.post(url,req);
  }

  loadNote(noteId: number){
    const url = "/api/notes/"+noteId;
    return this.http.get<Note>(url);
  }
  updateNote(id: number,title: string,body: string,lessonId: number,finished:boolean,userId: number){
    const url = "/api/notes/update/"+id;
    let req = { title: title, lesson_id: lessonId, student_id: userId, body: body, isFinished: finished };
    return this.http.put(url,req);
  }

  writeGroupNotes(notes: GroupNote){
    const url = "/api/notes/groupCreate";
    this.http.post(url,notes).subscribe();
  }
}

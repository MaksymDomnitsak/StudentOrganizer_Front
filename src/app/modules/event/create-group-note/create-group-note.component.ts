import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StudentService } from 'src/app/services/student.service';
import { AuthService } from '../../auth/services/auth.service';
import { Student } from 'src/app/models/student';
import { NoteService } from '../../note/services/note.service';
import { EXTRA_ARRAYS } from 'src/app/models/extraarrays';
import { GroupNote } from 'src/app/models/groupnote';
import { Router } from '@angular/router';
import { EventCustom } from 'src/app/models/scheduleWithTime';
import { Schedule } from 'src/app/models/schedule';
import { GroupDto } from 'src/app/models/groupdto';
import { GroupWithStudents } from 'src/app/models/groupWithStudents';

@Component({
  selector: 'app-create-group-note',
  templateUrl: './create-group-note.component.html',
  styleUrls: ['./create-group-note.component.css']
})
export class CreateGroupNoteComponent {
  noteForm!: FormGroup;
  schedule: Schedule[] = [];
  groups: GroupWithStudents[] = [];
  students: Student[] = [];
  daysList = EXTRA_ARRAYS.weekdays;

  constructor(private formBuilder: FormBuilder,
     private groupService: GroupService,
     private noteService:NoteService, 
     private scheduleService: ScheduleService, 
     private studentService: StudentService, 
     private auth: AuthService,
     private router: Router) {
      this.schedule = scheduleService.getSchedulebyTeacher(this.auth.userProfile.value.userId);
      studentService.getStudents().subscribe((response: Student[]) => {response.forEach((item)=>this.students.push(item));});
      groupService.getGroupsWithStudents().subscribe((response: GroupWithStudents[]) => {response.forEach((item)=>this.groups.push(item));});
      
   }

  ngOnInit(): void {
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      schedule: ['', Validators.required],
      body: ['', Validators.required],
      groups: [[]],
      attendees: [[]]
    });
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      const grps: number[] = this.noteForm.get('groups')?.value;
      const selectedIDs: number[] = [];
      this.groups.filter(group => grps.includes(group.id)) 
      .forEach(group => {
      const ids = group.students.map(student => student.id); 
      selectedIDs.push(...ids); 
      });
      const attendees: number[] = this.noteForm.get('attendees')?.value || [];
      selectedIDs.push(...attendees);
      const uniqueIds = Array.from(new Set(selectedIDs));
      console.log(this.noteForm.get('groups')?.value)
      console.log(this.noteForm.get('attendees')?.value)
      let note = new GroupNote(this.noteForm.get("title")?.value, this.noteForm.get("schedule")?.value, uniqueIds ,this.noteForm.get("body")?.value);
      
      console.log(note);
      this.noteService.writeGroupNotes(note);
      this.router.navigate(['/event-page']);
    }
  }

  readLesson(lesson:Schedule){
     return lesson.subject.name+", "+this.daysList[lesson.dayOfWeek-1].toString()+", "+lesson.typeOfLesson;
  }
}
 
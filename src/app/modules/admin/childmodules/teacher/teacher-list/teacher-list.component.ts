import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Імпортуйте модель викладача // Сервіс для роботи з викладачами
import { Teacher } from 'src/app/models/teacher';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent {
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;

  teachers: Teacher[] = [];
  teacherForDelete: Teacher | undefined;
  indexForDelete!: number;

  constructor(
    private modalService: NgbModal,
    private service: TeacherService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.teachers = [];
  }

  ngOnInit() {
    this.service.loadAllTeachers().subscribe((response: Teacher[]) => {
      this.cleanList();
      response.forEach((item) => this.teachers.push(item));
    });
  }

  cleanList() {
    this.teachers.splice(0);
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
    this.cdr.detach();
    this.cdr.detectChanges();
  }

  openConfirmDeleteModal(teacher: Teacher, index: number) {
    this.teacherForDelete = teacher;
    this.indexForDelete = index;
    this.modalService.open(this.confirmDeleteModal);
  }

  onDeleteConfirmed() {
    this.teachers.splice(this.indexForDelete, 1);
    this.modalService.dismissAll(this.confirmDeleteModal);
    this.service.deleteTeacher(this.teacherForDelete!.id).subscribe(() => {
      this.router.navigateByUrl('/teachers', { skipLocationChange: true });
    });
  }

  cancelModal() {
    this.teacherForDelete = undefined;
    this.indexForDelete = -1;
    this.modalService.dismissAll(this.confirmDeleteModal);
  }

  isEventer(teacher: Teacher) {
    return !teacher.eventer ? 'Так' : 'Ні';
  }
}
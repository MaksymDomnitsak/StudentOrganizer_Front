import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Сервіс для роботи з групами
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  @ViewChild('confirmDeleteModal')
  confirmDeleteModal!: TemplateRef<any>;

  groups: Group[] = [];
  groupForDelete: Group | undefined;
  indexForDelete!: number;

  constructor(
    private modalService: NgbModal,
    private service: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Завантаження всіх груп
    this.service.getGroups().subscribe((response: Group[]) => {
      this.groups = response;
    });
  }

  openConfirmDeleteModal(group: Group, index: number): void {
    this.groupForDelete = group;
    this.indexForDelete = index;
    this.modalService.open(this.confirmDeleteModal);
  }

  onDeleteConfirmed(): void {
    this.groups.splice(this.indexForDelete, 1);
    this.modalService.dismissAll(this.confirmDeleteModal);
    this.service.deleteGroup(this.groupForDelete!.id).subscribe(() => {
      this.router.navigateByUrl('/groups', { skipLocationChange: true });
    });
  }

  cancelModal(): void {
    this.groupForDelete = undefined;
    this.indexForDelete = -1;
    this.modalService.dismissAll(this.confirmDeleteModal);
  }
}
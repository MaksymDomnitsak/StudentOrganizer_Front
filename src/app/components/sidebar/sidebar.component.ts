import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SaveUser } from 'src/app/models/saveUser';
import { SaveUserWithoutGroup } from 'src/app/models/saveUserWithoutGroup';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSidebarOpen = false;
  timeoutId!: number;
  userInfo: any = null;
  isEventer: boolean = false;
  role!: string;
  private subscription: Subscription = new Subscription();


  constructor(private service: AuthService,private router: Router){
  }

  ngOnInit(): void {
    this.timeoutId = 5;
    this.subscription = this.service.userProfile.subscribe((profile) => {
      this.userInfo = profile;
      this.isEventer = profile.eventer;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  userRole(): string | null {
    return localStorage.getItem("role");
  }

  eventer() : boolean{
    return this.service.loadEventer();
  }

  openSidebar() {
    clearTimeout(this.timeoutId);
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.timeoutId = setTimeout(() => {
      this.isSidebarOpen = false;
    }, 300);
  }

  login(){
    this.service.login();
  }

  logOut() {
    this.service.logout().subscribe({
      next: () => {
        this.service.userProfile.next({
          userId: 0,
          email: '',
          userName: '',
          isEventer: false,
          jwtToken: '',
          accessToken: '',
          groupId: '',
          role: ''
        });
        this.isEventer = false;
        this.service.isTokenReady.next(false);
        this.router.navigateByUrl('',{ skipLocationChange: true }).then(() => {
          this.router.navigateByUrl('/dashboard');
        });
      },
    });
    window.location.href = "http://localhost:4200/dashboard";
}
  setUser(){
    const user = localStorage.getItem('user');
    console.log(user)
    if(user){
    this.userInfo = JSON.parse(user);
    console.log(localStorage.getItem('user'));
    console.log(this.userInfo);
  }
}
}


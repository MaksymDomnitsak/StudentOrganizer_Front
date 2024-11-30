import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveUser } from 'src/app/models/saveUser';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Router } from '@angular/router';
import { filter, Observable, take } from 'rxjs';
import { SaveUserWithoutGroup } from 'src/app/models/saveUserWithoutGroup';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_URI: string = "api/userstokens"
  constructor(private http: HttpClient,private route:Router,) {}

  userProfile: BehaviorSubject<any> = new BehaviorSubject<any>({
    userId: 0,
    email: '',
    userName: '',
    isEventer: false,
    jwtToken: '',
    accessToken: '',
    groupId: '',
    role: ''
  });

  isTokenReady = new BehaviorSubject<boolean>(false);

  login() {
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code&client_id=931292101113-047eg39rj4ihlcdoluc7j91p55586nm9.apps.googleusercontent.com&scope=email%20openid%20profile%20https://www.googleapis.com/auth/documents%20https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/meetings.space.created&state=-5dhuU2S57_pO3PbQ6aKyb2cEc23kuIq3goDyfGje9I%3D&redirect_uri=http://localhost:8080/api/oauth/callback/google&nonce=iLYhxaLWpKdBRCaH7MJFpVrekTtD6Aai1sTJMJexMYI';
    /*authFlow.subscribe({
      next: (user: SaveUser) => {
        this.saveUserToLocalStorage(user);
        console.log(user);
        this.route.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log(error);
      },
    });*/
  }

  getTokens(email: string): void {
    var userWithoutGroupId: SaveUserWithoutGroup = {    
      userId: 0,
      email: '',
      userName: '',
      isEventer: false,
      jwtToken: '',
      accessToken: '',
      role: ''}
    this.http.post<SaveUserWithoutGroup>(this.AUTH_URI+'/api/oauth/getCreds', { email }).subscribe({
      next: (user: SaveUserWithoutGroup) => {
        userWithoutGroupId = user;
        localStorage.setItem("user", JSON.stringify(userWithoutGroupId));
        localStorage.setItem("role", userWithoutGroupId.role)
        
        
        //this.route.navigate(['/dashboard']);
        const updatedProfile = {
          userId: user.userId,
        email: user.email,
        userName: user.userName,
        isEventer: user.isEventer,
        jwtToken: user.jwtToken,
        accessToken: user.accessToken,
        groupId: 'empty',
        role: user.role
        }
        this.userProfile.next(updatedProfile);
        
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.isTokenReady.next(true);
    localStorage.setItem("user", JSON.stringify(userWithoutGroupId))
    if(localStorage.getItem("role") == "STUDENT"){
    this.http.get<number>("api/studgroups/api/students/byEmail").subscribe({
      next: (id: number) => {
        userWithoutGroupId.groupId = id;
      }
    })
    }
  }

  saveUserToLocalStorage(user: SaveUser) {
    this.userProfile.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  loadUserFromLocalStorage(): SaveUser {
    if (this.userProfile.getValue().userId == 0) {
      let fromLocalStorage = localStorage.getItem('user');
      if (fromLocalStorage) {
        let userInfo = JSON.parse(fromLocalStorage);
        this.userProfile.next(userInfo);
      }
    }
    return this.userProfile.value;
  }
  refreshCookie() {
    return this.http.post('api/auth/refreshToken', {
      withCredentials: true,
    });
  }

  loadRole(): string{
    if (this.userProfile.getValue().userId == 0) {
      let fromLocalStorage = localStorage.getItem('user');
      if (fromLocalStorage) {
        let userInfo = JSON.parse(fromLocalStorage);
        this.userProfile.next(userInfo);
      }
    }
    return this.userProfile.getValue().role;
  }

  loadEventer(): boolean{
    console.log(this.userProfile.getValue().eventer);
    return this.userProfile.getValue().eventer;
  }

  logout() {
    return this.http.post(this.AUTH_URI+"/api/oauth/logout","1");
}
}

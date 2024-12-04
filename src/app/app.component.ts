import { ChangeDetectorRef, Component,OnInit} from '@angular/core';
import { SaveUser } from './models/saveUser';
import { AuthService } from './modules/auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from './services/cookie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  userInfo?: SaveUser;
  title = 'StudentOrganizer';
  currentRoute!: string;

  constructor(private auth: AuthService,private route: ActivatedRoute,private router: Router, private cookie: CookieService,private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.auth.userProfile.subscribe((data) => {
      this.userInfo = data;
    });
    const email = this.cookie.getCookie('Email');

    if (email) {
      this.auth.getTokens(email);
      this.cookie.deleteCookie("Email");
    } else {
      console.error('Email cookie not found!');
    }
  }

  ngDoCheck(){
    this.currentRoute = this.router.url;
  }

  
}

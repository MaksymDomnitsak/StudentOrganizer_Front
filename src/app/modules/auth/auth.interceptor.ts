import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private route: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*if (request.url.indexOf('/refreshToken') > -1) {
      return next.handle(request);
    }*/

      if(localStorage.getItem('user') !== null){
        const token = JSON.parse(localStorage.getItem('user')!).jwtToken;
        const accessToken = JSON.parse(localStorage.getItem('user')!).accessToken;
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `${token}`
            }
          });
        }
        if (request.url.search("report") > 0 || request.url.search("calendar") > 0 ){
          request = request.clone({
            setHeaders: {
              Authorization: `${token}`,
              Google: `${accessToken}`
            }
          });
        }
        if (request.url.search("logout") > 0){
          const accessToken = JSON.parse(localStorage.getItem('user')!).accessToken;
          request = request.clone({
            setHeaders: {
              Revoke: `${accessToken}`
            }
          });
          localStorage.removeItem('user');
          localStorage.removeItem('role');
        }
      }
      return next.handle(request).pipe(
        catchError((error) => {
          if (error.status == 401) {
            return this.handle401Error(request, next, error);
          } else {
            return throwError(() => error);
          }
        })
      );

  }
   

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler,
    originalError: any
  ) {
    return this.authService.refreshCookie().pipe(
      switchMap(() => {
        return next.handle(req);
      }),
      catchError((error) => {
        this.authService.login(); // зробити логіку refresh
        //this.route.navigate(['/auth/login']);
        return throwError(() => originalError);
      })
    );
  }

}

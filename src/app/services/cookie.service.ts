import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; Path=/; Expires=Sat, 01 Jan 2000 00:00:00 UTC;`;
  }
}

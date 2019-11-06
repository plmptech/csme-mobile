import { Injectable } from '@angular/core';
import {EnvService} from './env.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;

  constructor(
      private http: HttpClient,
      private env: EnvService,
  ) { }

    // login(accountInfo: any) {
    //     const seq = this.http.get(this.env.API_URL + 'user/login', accountInfo);
    //     seq.subscribe((res: any) => {
    //         if (res.status === 'success') {
    //             this.isLoggedIn = true;
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     });
    //     return false;
    //
    // }
   login(email: string, password: string) {

    return this.http.get(this.env.API_URL + 'user/login?email='
     + email + '&password=' + password); // .pipe(
    //     tap(token => {
    //       // this.storage.setItem('token', token)
    //       //     .then(
    //       //         () => {
    //       //           console.log('Token Stored');
    //       //         },
    //       //         error => console.error('Error storing item', error)
    //       //     );
    //       // this.token = token;
    //       // this.isLoggedIn = true;
    //       return token;
    //     }),
    // );
   }

  register(email: string,  name: string, password: string, confirm: string) {
    return this.http.post(this.env.API_URL + 'user/register',
        {email, name, password, confirm},
    );
  }

  logout() {
    const headers = new HttpHeaders({
      Authorization: this.token.token_type + ' ' + this.token.access_token
    });
    return this.http.get(this.env.API_URL + 'user/logout', { headers })
        .pipe(
            tap(data => {
              // this.storage.remove('token');
              // this.isLoggedIn = false;
              // delete this.token;
              return data;
            })
        );
  }

  user() {
    const headers = new HttpHeaders({
      Authorization: this.token.token_type + ' ' + this.token.access_token
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers })
        .pipe(
            tap(user => {
              return user;
            })
        );
  }

  // getToken() {
  //   return this.storage.getItem('token').then(
  //       data => {
  //         this.token = data;
  //         if (this.token != null) {
  //           this.isLoggedIn = true;
  //         } else {
  //           this.isLoggedIn = false;
  //         }
  //       },
  //       error => {
  //         this.token = null;
  //         this.isLoggedIn = false;
  //       }
  //   );
  // }
}

import {Injectable} from '@angular/core';
import {EnvService} from './env.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {User} from '../models/user';
import {Observable, Subscription} from 'rxjs';
import {NativeStorage} from '@ionic-native/native-storage';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn = false;
    // token: any;
    private userInfo: Subscription;
    private setDetails: Observable<any>;

    constructor(
        private http: HttpClient,
        private env: EnvService,
        // private storage: NativeStorage
    ) {
    }

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
    // async login(email: string, password: string) {
    //     this.userInfo = this.http.get(this.env.API_URL + 'user/login?email=' + email + '&password=' + password).subscribe(
    //         (res: any) => {
    //             console.log(res);
    //             if (res.status !== 'error') {
    //                 this.isLoggedIn = true;
    //                 this.token = res.token;
    //                 // this.storage.setItem('token', res.token);
    //                 console.log('token stored');
    //                 return true;
    //             } else {
    //                 this.token = '';
    //                 return false;
    //             }
    //         },
    //         error => {
    //             console.log(error);
    //         }
    //     );
    //     return false;
    //
    // }

    register(email: string, name: string, password: string, confirm: string) {
        return this.http.post(this.env.API_URL + 'user/register',
            {email, name, password, confirm},
        );
    }

    logout() {
        const headers = new HttpHeaders({
            Authorization: this.token.token_type + ' ' + this.token.access_token
        });
        return this.http.get(this.env.API_URL + 'user/logout', {headers})
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
        return this.http.get<User>(this.env.API_URL + 'auth/user', {headers})
            .pipe(
                tap(user => {
                    return user;
                })
            );
    }

    getUserInfo() {
        this.http.get<User>(this.env.API_URL + 'user/info?token=' + localStorage.getItem('token'));
    }

}

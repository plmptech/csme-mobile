import {Injectable} from '@angular/core';
import {EnvService} from './env.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../models/user';
import {Observable, Subscription} from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private env: EnvService,
        private storage: Storage) {
    }
    isLoggedIn = false;
    listOfListing: any[] = [];
    currentPageNo: number;
    lastPageNo: number;
    totalNoPages: number;
    // token: any;
    private userInfo: Subscription;
    private setDetails: Observable<any>;
    data = undefined;

    login(email: string, password: string) {

        return this.http.get(this.env.API_URL + 'user/login?email='
            + email + '&password=' + password); // .pipe(
    }

    register(email: string, name: string, password: string, confirm: string) {
        return this.http.post(this.env.API_URL + 'user/register',
            {email, name, password, confirm},
        );
    }

    /*logout() {
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
    }*/

    /*user() {
        const headers = new HttpHeaders({
            Authorization: this.token.token_type + ' ' + this.token.access_token
        });
        return this.http.get<User>(this.env.API_URL + 'auth/user', {headers})
            .pipe(
                tap(user => {
                    return user;
                })
            );
    }*/

    getUserListing() {
        return this.http.get(this.env.API_URL + 'user/info?token=' + localStorage.getItem('token'))
    }

    getUserInfo() {
        this.http.get<User>(this.env.API_URL + 'user/info?token=' + localStorage.getItem('token'))
            .subscribe(user => {
                this.storage.set('currentUser', user);
            });

    }

    async getAllListings() {
        this.http.get(this.env.API_URL + 'listings/search?category=&country=&city=&askingPrice&revenue' +
            '&cashflow&direction=&sort=&page=&perPage=').subscribe(user => {
                return user
            })
    }

    clearStoredInfo() {
        this.storage.clear();
        localStorage.clear();
    }

}

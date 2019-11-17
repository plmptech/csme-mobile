import {Injectable} from '@angular/core';
import {EnvService} from './env.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../models/user';
import {Observable, Subscription} from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import {NavController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private allListings: Promise<any>;
    isLoggedIn = false;
    listOfListing: any[] = [];
    currentPageNo: number;
    lastPageNo: number;
    totalNoPages: number;
    // token: any;
    private userInfo: Subscription;
    private setDetails: Observable<any>;

    constructor(
        private http: HttpClient,
        private env: EnvService,
        private storage: Storage) {
    }

    login(email: string, password: string) {

        return this.http.get(this.env.API_URL + 'user/login?email='
            + email + '&password=' + password); // .pipe(
    }

    register(email: string, name: string, password: string, confirm: string) {
        return this.http.post(this.env.API_URL + 'user/register',
            {email, name, password, confirm},
        );
    }

    /*
    this.authService.createListingNow(form.value.name, this.purpose, this.industry, form.value.country, form.value.city,
         form.value.price, form.value.revenue, form.value.cashflow, form.value.age, form.value.description,
        localStorage.getItem('token'))
     */
    createListingNow(name: string, purpose: string, industry: string, country: string, city: string, age: number,
                     price: number, revenue: number, cashflow: number,  description: string, token: string ) {
        return this.http.post(this.env.API_URL + 'listing',
            {name, purpose, industry, country, city, age, price, revenue, cashflow, description, token},
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
        return this.http.get(this.env.API_URL + 'user/info?token=' + localStorage.getItem('token'));
    }

    getUserInfo() {
        this.http.get<User>(this.env.API_URL + 'user/info?token=' + localStorage.getItem('token'))
            .subscribe(user => {
                if (user.status !== 'error') {
                    this.storage.set('currentUser', user);
                } else {
                    this.storage.set('currentUser', '');
                }

            });

    }

    // async getAllListings() {
    //     return this.http.get(this.env.API_URL + 'listings/search?category=&country=&city=&askingPrice&revenue' +
    //         '&cashflow&direction=&sort=&page=&perPage=').pipe(map((res: Response) => {
    //         this.allListings = res.json();
    //         console.log(this.allListings);
    //     }));
    // }

    async getAllListings() {
        return this.http.get(this.env.API_URL + 'listings/search?category=&country=&city=&askingPrice&revenue' +
            '&cashflow&direction=&sort=&page=&perPage=')
            .toPromise()
            .then((data: any) => {
                console.log(data);
                console.log('Success', data.listings);
                return data.listings;
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    clearStoredInfo() {
        this.storage.clear();
        localStorage.clear();
    }

}

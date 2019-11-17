import {Component, OnInit} from '@angular/core';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {SearchFilterPage} from '../pages/modal/search-filter/search-filter.page';
import {Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../services/env.service';
import {map} from 'rxjs/operators';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

    businessListing: any;
    private allListing: any;
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalCount: number;
    nextPageListing: any;
    countNewListing: number;

    category: string;
    country: string;
    city: string;
    askingPrice: string;
    revenue: string;
    sort: string;
    cashflow: string;

    constructor(public navCtrl: NavController,
                public modalCtrl: ModalController,
                private authService: AuthService,
                private http: HttpClient,
                private menuCtrl: MenuController,
                private env: EnvService ) {

        this.currentPage = 1;
        this.lastPage = 1;
        this.perPage = 3;
        this.countNewListing = 0;
        this.businessListing = [

            {
                user_avtar: 'assets/img/marty-avatar.png',
                user_name: 'Marty McFly',
                date: 'November 5, 1955',
                image: 'assets/img/advance-card-bttf.png',
                content: 'Wait a minute. Wait a minute, Doc. Uhhh.... out of a DeLorean?! Whoa. This is heavy.',
            },
            {
                user_avtar: 'assets/img/sarah-avatar.png.jpeg',
                user_name: 'Sarah Connor',
                date: 'May 12, 1984',
                image: 'assets/img/advance-card-tmntr.jpg',
                content: 'I face the unknown future, wialue of human life, maybe we can too.'
            },
            {
                user_avtar: 'assets/img/ian-avatar.png',
                user_name: 'Dr. Ian Malcolm',
                date: 'June 28, 1990',
                image: 'assets/img/advance-card-jp.jpg',
                content: 'Your scientists were y didn\'t stop to think if they should.'
            }
        ];
    }

    async ngOnInit() {
        this.menuCtrl.enable(true);
        console.log('stored token: ' + localStorage.getItem('token'));
        if (localStorage.getItem('token') !== null) {
            this.authService.getUserInfo();
        }

        this.getAllListing();
    }

    // fresh listing
    getAllListing() {
        console.log('current page: ' + this.currentPage);
        console.log('last page: ' + this.lastPage);
        this.allListing = this.http.get(this.env.API_URL + 'listings/search?category=&country=&city=&askingPrice&revenue' +
            '&cashflow&direction=&sort=&page=' + this.currentPage + '&perPage=' + this.perPage)
            .toPromise()
            .then((data: any) => {
                console.log(data);
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;
                return data.listings;
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    getNextPage() {
        this.nextPageListing = this.http.get(this.env.API_URL + 'listings/search?category=&country=&city=&askingPrice&revenue' +
            '&cashflow&direction=&sort=&page=' + this.currentPage + '&perPage=' + this.perPage)
            .toPromise()
            .then((data: any) => {
                console.log(data);
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;
                return data.listings;
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    getFilteredListings(result) {
        console.log('current page: ' + this.currentPage);
        console.log('last page: ' + this.lastPage);
        const askingPrice = result.lowerPrice + ',' + result.upperPrice;
        this.allListing = this.http.get(this.env.API_URL + 'listings/search?category=' + result.category + '&country=' + result.country +
            '&city=' + result.city + '&askingPrice=' + askingPrice + '&revenue&cashflow&direction=&sort=' +
            '&page=' + this.currentPage + '&perPage=' + this.perPage)
            .toPromise()
            .then((data: any) => {
                console.log(data);
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;
                return data.listings;
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    refreshListings(event) {
        this.currentPage = 1;
        this.getAllListing();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    loadNextPage(event) {
        setTimeout(() => {
            if (this.lastPage - this.currentPage > 0) {
                this.currentPage = this.currentPage + 1;
                console.log('fetching more');
                this.getNextPage();
                this.mergeList();
            }
            event.target.complete();
        }, 500);
    }

    mergeList() {
        Promise.all([this.allListing, this.nextPageListing]);
    }
    async searchFilter() {
        const modal = await this.modalCtrl.create({
            component: SearchFilterPage
        });
        modal.present();

        await modal.onDidDismiss().then((res) => {
            console.log(res.data);
            this.getFilteredListings(res.data);
        });
    }

    async openProfilePage() {
        if (localStorage.getItem('token')) {
            this.navCtrl.navigateForward('profile-menu');
        } else {
            this.navCtrl.navigateForward('/login');
        }
    }
}

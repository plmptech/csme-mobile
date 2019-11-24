import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { SearchFilterPage } from '../pages/modal/search-filter/search-filter.page';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { EnvService } from '../services/env.service';
import { ListingDetailPage } from '../pages/modal/listing-detail/listing-detail.page';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

    private allListing: Array<Listing> = [];
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalCount: number;
    countNewListing: number;
    searchKey: String;

    industry: string;
    category: string;
    country: string;
    city: string;
    askingPrice: string;
    revenue: string;
    sort: string;
    cashflow: string;
    res: string;
    user: any;

    constructor(public navCtrl: NavController,
        public modalCtrl: ModalController,
        private authService: AuthService,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private menuCtrl: MenuController,
        private env: EnvService,
    ) {
        this.currentPage = 1;
        this.lastPage = 1;
        this.perPage = 3;
        this.countNewListing = 0;
    }

    async ngOnInit() {
        this.getListing();
    }

    ionViewWillEnter() {
        console.log('stored token: ' + localStorage.getItem('token'));
        // if (localStorage.getItem('token') !== null) {
        //     this.authService.getUserInfo();
        // }
    }


    // fresh listing
    async getListing() {
        console.log('current page: ' + this.currentPage);
        console.log('last page: ' + this.lastPage);
        this.http.get<Listing>(this.env.API_URL + 'listings/search?category=&country=&city=&askingPrice&revenue' +
            '&cashflow&direction=&sort=&page=' + this.currentPage + '&perPage=' + this.perPage)
            .toPromise()
            .then((data: any) => {
                console.log(data);
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;
                (data.listings).forEach(item => {
                    console.log(item);
                    if (item.photo.data.length != 0) {
                        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(item.photo.data)))
                        item.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String)
                    }
                    else
                        item.photo = '/assets/shapes.svg'
                    this.allListing.push(item);
                });
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    getFilteredListings(result) {
        this.currentPage = 1;
        this.allListing = [];
        const askingPrice = result.lowerPrice + ',' + result.upperPrice;

        this.http.get(this.env.API_URL + 'listings/search?category=' + result.category + '&country=' + result.country +
            '&city=' + result.city + '&askingPrice=' + askingPrice + '&revenue&cashflow&direction=&sort=' +
            '&page=' + this.currentPage + '&perPage=' + this.perPage)
            .toPromise()
            .then((data: any) => {
                console.log(data);
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;

                console.log(data.listings);
                (data.listings).forEach(item => {
                    console.log(item);
                    if (item.photo.data.length != 0) {
                        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(item.photo.data)))
                        item.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String)
                    }
                    else
                        item.photo = '/assets/shapes.svg'
                    this.allListing.push(item);
                });
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    async searchListing() {
        this.allListing = [];
        this.http.get<Listing>(this.env.API_URL + 'listings/search?name=' + this.searchKey + '&category=&country=&city=&askingPrice&revenue' +
            '&cashflow&direction=&sort=&page=' + this.currentPage + '&perPage=' + this.perPage)
            .toPromise()
            .then((data: any) => {
                console.log(data);
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;
                (data.listings).forEach(item => {
                    console.log(item);
                    if (item.photo.data.length != 0) {
                        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(item.photo.data)))
                        item.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String)
                    }
                    else
                        item.photo = '/assets/shapes.svg'
                    this.allListing.push(item);
                });
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
        console.log(this.searchKey)
    }

    async refreshListings(event) {
        this.currentPage = 1;
        await this.getListing();
        event.target.complete();
    }

    async loadNextPage(event) {
        if (this.lastPage - this.currentPage > 0) {
            this.currentPage = this.currentPage + 1;
            await this.getListing();
        }
        event.target.complete();

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

    async openListingDetail(item: any) {
        console.log(item);
        const modal = await this.modalCtrl.create({
            component: ListingDetailPage,
            componentProps: {
                id: item.id, name: item.name, purpose: item.purpose, industry: item.industry,
                age: item.age, created: item.created, country: item.country, city: item.city,
                revenue: item.revenue, description: item.description, cashFlow: item.cashFlow,
                askingPrice: item.askingPrice, user: item.user, photo: item.photo
            }
        });
        return await modal.present();
    }

}

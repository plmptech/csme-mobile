import {Component, OnInit} from '@angular/core';
import {IonSlides, LoadingController, MenuController, ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {SearchFilterPage} from '../pages/modal/search-filter/search-filter.page';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {EnvService} from '../services/env.service';
import {ListingDetailPage} from '../pages/modal/listing-detail/listing-detail.page';

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
    searchKey: string;

    industry: string;
    country: string;
    city: string;
    askingPrice: string;
    revenue: string;
    sort: string;
    cashflow: string;
    res: string;
    user: any;
    listings: any;
    type: any;
    showLoadMore = false;
    showLoadMoreText = true;
    showSpinner = false;
    tempPrice: any;
    lowerPricee: any;
    upperPricee: any;
    showNoRecordsFound = false;

    slideOptions = {
        initialSlide: 0,
        speed: 400,
    };

    constructor(public navCtrl: NavController,
                public modalCtrl: ModalController,
                private authService: AuthService,
                private http: HttpClient,
                private sanitizer: DomSanitizer,
                private menuCtrl: MenuController,
                private env: EnvService,
                private loadingCtrl: LoadingController
    ) {
        this.currentPage = 1;
        this.lastPage = 1;
        this.perPage = 4;
        this.country = '';
        this.city = '';
        this.askingPrice = '';
        this.industry = '';
    }

    async ngOnInit() {
        const loading = this.loadingCtrl.create({
            message: 'Retrieve listings',
            duration: 3000,
            spinner: 'circles'
        }).then((res) => {
            res.present();

            this.listings = this.getListing();
        });

        if (this.listings !== null) {
            this.loadingCtrl.dismiss();
            this.showLoadMore = false;
        } else {
            this.showNoRecordsFound = true;
        }
    }

    slidesDidLoad(slides: IonSlides) {
        slides.startAutoplay();
    }

    ionViewWillEnter() {
        console.log('stored token: ' + localStorage.getItem('token'));
        // if (localStorage.getItem('token') !== null) {
        //     this.authService.getUserInfo();
        // }
    }


    // fresh listing
    async getListing() {
        console.log('getting listing');
        let url = this.env.API_URL + 'listings/search?page=' + this.currentPage + '&perPage=' + this.perPage;
        if (this.searchKey) {
            url += '&name=' + this.searchKey;
        }
        if (this.industry) {
            url += '&industry=' + this.industry;
        }
        if (this.country) {
            url += '&country=' + this.country;
        }
        console.log(this.type);
        if (this.type) {
            url += '&type=' + this.type;
        }
        if (this.city) {
            url += '&city=' + this.city;
        }
        if (this.askingPrice) {
            url += '&askingPrice=' + this.askingPrice;
        }
        this.http.get<Listing>(url)
            .toPromise()
            .then((data: any) => {
                this.currentPage = data.currentPage;
                this.lastPage = data.lastPage;
                this.perPage = data.perPage;
                this.totalCount = data.totalCount;
                console.log(this.totalCount);
                (data.listings).forEach(item => {
                    console.log(item);
                    if (item.photo.data.length !== 0) {
                        const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(item.photo.data)));
                        item.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
                    } else {
                        item.photo = '/assets/shapes.svg';
                    }
                    this.allListing.push(item);
                    this.showLoadMore = true;
                    if (data.currentPage === data.lastPage) {
                        this.showLoadMore = false;
                    }

                    this.showLoadMoreText = true;
                    this.showSpinner = false;
                });
                if (this.totalCount === 0) {
                    this.showNoRecordsFound = true;
                } else {
                    this.showNoRecordsFound = false;
                }
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }

    getFilteredListings() {
        this.currentPage = 1;
        this.allListing = [];
        this.getListing();
    }

    async searchListing() {
        this.currentPage = 1;
        this.allListing = [];
        await this.getListing();
    }

    async refreshListings(event) {
        this.currentPage = 1;
        this.allListing = [];
        const loading = this.loadingCtrl.create({
            message: 'Refresh listings',
            duration: 2000,
            spinner: 'circles'
        }).then(async (res) => {
            res.present();

            await this.getListing();
        });
        event.target.complete();
    }

    async loadNextPage(event) {
        this.showLoadMoreText = false;
        this.showSpinner = true;
        console.log('loading next page');
        console.log(this.lastPage, this.currentPage);
        if (this.lastPage - this.currentPage > 0) {
            this.currentPage = this.currentPage + 1;
            await this.getListing();
        }
        event.target.complete();

    }

    async searchFilter() {
        this.tempPrice = this.askingPrice.split(',');
        const modal = await this.modalCtrl.create({
            component: SearchFilterPage,
            componentProps: {
              country: this.country, industry: this.industry, type: this.type, priceLow: this.lowerPricee, priceHigh: this.upperPricee,
                sortBy: this.sort
            }
        });
        modal.present();

        await modal.onDidDismiss().then((res) => {
            this.country = res.data.country;
            this.sort = res.data.sortBy;
            // this.city = res.data.city;
            this.industry = res.data.industry;
            this.type = res.data.type;
            this.askingPrice = res.data.lowerPrice + ',' + res.data.upperPrice;
            this.showLoadMore = false;
            this.lowerPricee = res.data.lowerPrice;
            this.upperPricee = res.data.upperPrice;
            this.getFilteredListings();
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
            componentProps: item
        });
        return await modal.present();
    }

    

}

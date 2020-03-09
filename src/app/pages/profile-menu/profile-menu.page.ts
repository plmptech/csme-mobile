import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../services/env.service';
import { AlertService } from '../../services/alert.service';
import { Observable } from 'rxjs';
import {EditlistingPage} from '../listing/editlisting/editlisting.page';
import {DomSanitizer} from '@angular/platform-browser';
import {SendEnquiryPage} from '../modal/send-enquiry/send-enquiry.page';
import {TermsConditionsPage} from '../modal/terms-conditions/terms-conditions.page';

function ionViewDidLoad() {

}

@Component({
    selector: 'app-profile-menu',
    templateUrl: './profile-menu.page.html',
    styleUrls: ['./profile-menu.page.scss'],
})
export class ProfileMenuPage implements OnInit {
    user: any;
    res: any;
    private ownListings: any;
    emptyListing: boolean;
    public appPages: Array<Pages>;
    constructor(
        private navCtrl: NavController,
        private storage: Storage,
        private authService: AuthService,
        private http: HttpClient,
        private env: EnvService,
        private alertService: AlertService,
        private modalCtrl: ModalController,
        private sanitizer: DomSanitizer) {
        this.appPages = [
            {
                title: 'MY LISTING',
                url: '/mylistings',
                direct: 'root',
                icon: 'list'
            },
        ];


    }
    ionViewDidEnter() {
        this.getOwnListing();
        this.emptyListing = false;
    }

    async ionViewWillEnter() {
        if (!localStorage.getItem('token')) {
            this.navCtrl.navigateRoot('/login');
            this.authService.clearStoredInfo();
            localStorage.clear();
        }
    }

    async ngOnInit() {
        this.authService.getUserInfo();
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        this.user = await this.getUser();
    }

    async getUser(): Promise<any> {
        this.storage.get('currentUser').then(res => {
            this.user = res.user;
        });
    }
    goToEditProfile() {
        this.navCtrl.navigateRoot('profile-edit');
    }

    goHome() {
        this.navCtrl.navigateRoot('/home');
    }

    logout() {
        this.authService.clearStoredInfo();
        this.navCtrl.navigateRoot('home');
    }

    upgradeUser() {
        // const headers = new Headers({ 'Content-Type': 'application/json' });
        // this.http.put<ReturnMessage>(this.env.API_URL + 'user/' + this.res.user._id + '/upgrade', headers).subscribe(
        //     res => {
        //       console.log(res);
        //       this.alertService.presentToast(res.message);
        //     },
        //     error => {
        //       alert(error.text());
        //       console.log(error.text());
        //     });

        const body = { token: localStorage.getItem('token') };

        this.http.put<ReturnMessage>(this.env.API_URL + 'user/upgrade', body).subscribe(
            response => {
                console.log(response);
                this.alertService.presentToast(response.message);
            },
            error => {
                alert(error.text());
                console.log(error.text());
                this.alertService.presentToast(error.text);
            });

    }

    async viewTerms() {
        const modal = await this.modalCtrl.create({
            component: TermsConditionsPage,
        });
        return await modal.present();
    }

    getOwnListing() {
        this.ownListings = this.http.get(this.env.API_URL + 'user/listing?token=' + localStorage.getItem('token'))
            .toPromise()
            .then((data: any) => {
                if (data.user.listings.length === 0) {
                    this.emptyListing = true;
                }
                console.log(data.user.listings);
                for (const l of data.user.listings) {
                    if (l.photo.data.length !== 0) {
                        const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(l.photo.data)));
                        l.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
                    } else {
                        l.photo = '/assets/shapes.svg';
                    }
                }
                console.log(data.user.listings);
                return data.user.listings;
            })
            .catch(err => {
                console.log('Error', err);
                return err;
            });
    }


    openAddListing() {
        this.navCtrl.navigateForward('/addlisting');
    }

    async openListingDetail(item: any) {
        console.log(item);
        const modal = await this.modalCtrl.create({
            component: EditlistingPage,
            componentProps: item
            // componentProps: {
            //   id: item._id, name: item.name, purpose: item.purpose, age: item.age,
            //   industry: item.industry, created: item.created, country: item.country, city: item.city,
            //   revenue: item.revenue, askingPrice: item.askingPrice,
            //   cashFlow: item.cashFlow, description: item.description, user: item.user
            // }
        });
        return await modal.present();
    }
}

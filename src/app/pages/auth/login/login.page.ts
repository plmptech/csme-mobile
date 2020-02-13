import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';



@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
    private loginResult: any;
    private userDetails: Observable<any>;

    constructor(
        private modalCtrl: ModalController,
        private authService: AuthService,
        private alertService: AlertService,
        private navCtrl: NavController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        private storage: Storage
    ) {
    }

    ngOnInit() {
        // if (localStorage.getItem('token')) { this.navCtrl.navigateBack('/profile-menu'); }
        if (localStorage.getItem('token') !== null) {
            console.log(localStorage.getItem('token'));
            this.authService.getUserInfo();
            this.storage.get('isLoggedIn').then(res => {
                console.log(res);
                this.navCtrl.navigateBack('/home');
            });
        }
    }

    goHome() {
        this.navCtrl.navigateBack('/home');
    }

    forgotPassword() {
        this.navCtrl.navigateBack('/forgotpassword');
    }

    async registerModal() {
        this.navCtrl.navigateForward('/register');
    }

    showAutoHideLoader() {
        this.loadingCtrl.create({
            message: 'Signing in',
            duration: 3000,
            spinner: 'circles'
        }).then((res) => {
            res.present();

            res.onDidDismiss().then((dis) => {
            });
        });
    }

    login(form: NgForm) {
        if (form.value.email !== '' && form.value.password !== '') {
            this.showAutoHideLoader();
            this.authService.login(form.value.email, form.value.password).subscribe((res: any) => {
                if (res.status !== 'error') {
                    if (res.message === 'Password change required') {
                        this.alertService.presentToast('Logged In');
                        this.navCtrl.navigateRoot('/changepassword');
                        localStorage.setItem('token', res.token);
                        this.authService.isLoggedIn = true;
                    }  else {
                        localStorage.setItem('token', res.token);
                        this.alertService.presentToast('Logged In');
                        this.authService.isLoggedIn = true;
                        this.navCtrl.navigateRoot('/home');
                    }
                } else {
                    this.alertService.presentToast('Invalid login. Please try again.');
                }
            },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.alertService.presentToast('Please fill in the required fields');
        }
    }
}

import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import {FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {RegisterPage} from '../register/register.page';
import {Observable} from 'rxjs';
import {NativeStorage} from '@ionic-native/native-storage';

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
        // private storage: NativeStorage
    ) {
    }

    ngOnInit() {

    }

    dismissLogin() {
        this.modalCtrl.dismiss();
        this.navCtrl.navigateRoot('/home');

    }

    // On Register button tap, dismiss login modal and open register modal
    async registerModal() {
        this.dismissLogin();
        const registerModal = await this.modalCtrl.create({
            component: RegisterPage
        });
        return await registerModal.present();
    }
    login(form: NgForm) {
        if (form.value.email !== '' && form.value.password !== '') {
            this.authService.login(form.value.email, form.value.password).subscribe((res: any) => {
                    if (res.status !== 'error') {
                        console.log(res);
                        localStorage.setItem('token', res.token);
                        console.log('stored token: ' + localStorage.getItem('token'));
                        this.alertService.presentToast('Logged In');
                        this.dismissLogin();
                        this.authService.isLoggedIn = true;
                        // this.authService.token = res.token;
                        this.navCtrl.navigateRoot('/home');
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


    // login(form: NgForm) {
    //     if (form.value.email !== '' && form.value.password !== '') {
    //         this.loginResult = this.authService.login(form.value.email, form.value.password);
    //         console.log(this.loginResult);
    //         if (this.loginResult) {
    //             this.userDetails = this.authService.getUserInfo();
    //             if (this.userDetails != null && (this.authService.isLoggedIn === true)) {
    //                 console.log('user details: ' + this.userDetails);
    //                 this.navCtrl.navigateRoot('/home');
    //             }
    //
    //         }
    //     }
    // }

}

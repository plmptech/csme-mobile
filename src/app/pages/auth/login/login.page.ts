import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Observable } from 'rxjs';



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
    ) {
    }

    ngOnInit() {
        if (localStorage.getItem('token')) this.navCtrl.navigateBack('/profile-menu');
    }

    goHome() {
        this.navCtrl.navigateBack('/home');
    }

    async registerModal() {
        this.navCtrl.navigateForward('/register');
    }

    login(form: NgForm) {
        if (form.value.email !== '' && form.value.password !== '') {
            this.authService.login(form.value.email, form.value.password).subscribe((res: any) => {
                if (res.status !== 'error') {
                    localStorage.setItem('token', res.token);
                    this.alertService.presentToast('Logged In');
                    this.authService.isLoggedIn = true;
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
}

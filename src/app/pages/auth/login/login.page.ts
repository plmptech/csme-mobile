import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {RegisterPage} from '../register/register.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;

  constructor(
      private modalCtrl: ModalController,
      private authService: AuthService,
      private alertService: AlertService,
      private navCtrl: NavController,
  ) { }

  ngOnInit() {

  }

  dismissLogin() {
    this.modalCtrl.dismiss();
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
    this.authService.login(form.value.email, form.value.password).subscribe(
        data => {
          this.alertService.presentToast('Logged In');
        },
        error => {
          console.log(error);
        },
        () => {
          this.dismissLogin();
          this.navCtrl.navigateRoot('/dashboard');
        }
    );
  }
}

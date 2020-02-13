import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {LoadingController, NavController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';
import {NgForm} from '@angular/forms';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  constructor(
      private authService: AuthService,
      private alertService: AlertService,
      private navCtrl: NavController,
      public loadingCtrl: LoadingController,
      private http: HttpClient,
      private env: EnvService,
  ) {

  }

  ngOnInit() {
  }

  goLoginPage() {
    this.navCtrl.navigateBack('/login');
  }

  getforgetPwLink(form: NgForm) {
    console.log(form.value.email);
    // check if email is correct format

    // const result = this.checkEmailValid(form.value.email);

    // if (result) {
    this.showAutoHideLoader();
    const body = { email: form.value.email };
    this.http.put<ReturnMessage>(this.env.API_URL + 'user/forget', body).subscribe(
          response => {
            console.log(response);
            if (response.status === 'ok') {
              this.alertService.presentToast('An email will be sent to you shortly.');
              this.navCtrl.navigateBack('/login');
            } else if (response.status === 'error') {
              this.alertService.presentToast('Email does not exist. Please try again.');
            } else {
              this.alertService.presentToast('Please enter email in valid format');
            }

          },
          error => {
            alert(error.text());
            console.log(error.text());
            this.alertService.presentToast(error.text);
          });
    // } else {
    //  this.alertService.presentToast('Please enter email in valid format');
    // }

  }


  // checkEmailValid(email) {
  //   // const re = /\S+@\S+\.\S+/;
  //   // console.log(re.test(email));
  //   // return re.test(email);
  //   return EmailValidator.validate(email);
  // }

  showAutoHideLoader() {
    this.loadingCtrl.create({
      message: 'Please wait..',
      duration: 3000,
      spinner: 'circles'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
  }
}

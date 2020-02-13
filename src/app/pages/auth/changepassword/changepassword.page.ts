import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {LoadingController, NavController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  constructor(private authService: AuthService,
              private alertService: AlertService,
              private navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private http: HttpClient,
              private env: EnvService) { }

  ngOnInit() {
  }

  changePassword(form: NgForm) {
    console.log(localStorage.getItem('token'), form.value.password, form.value.confirmpassword);
    const result = this.checkPassword(form.value.password, form.value.confirmpassword);
    if (result) {
      const body = {  token: localStorage.getItem('token')  , newPass: form.value.password, cfmPass: form.value.confirmpassword };

      this.http.put<ReturnMessage>(this.env.API_URL + 'user/change', body).subscribe(
          response => {
            console.log(response);
            if (response.status === 'ok') {
              this.alertService.presentToast('Password have been updated!');
              this.navCtrl.navigateBack('/home');
            } else {
              this.alertService.presentToast(response.status);
            }

          },
          error => {
            alert(error.text());
            console.log(error.text());
            this.alertService.presentToast(error.text);
          });

    } else {
        this.alertService.presentToast('Password do not match');
    }
  }

  checkPassword(pw1: string, pw2: string) {
      if (pw1 === pw2) {
        return true;
    } else {
        return false;
    }

  }

}

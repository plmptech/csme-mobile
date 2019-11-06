import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {NgForm} from '@angular/forms';
import {LoginPage} from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private modalCtrl: ModalController,
              private authService: AuthService,
              private navCtrl: NavController,
              private alertService: AlertService) { }

  ngOnInit() {
  }

  dismissRegister() {
    this.modalCtrl.dismiss();
  }

  // On Login button tap, dismiss Register modal and open login Modal
  async loginModal() {
    this.dismissRegister();
    const loginModal = await this.modalCtrl.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }
  register(form: NgForm) {
    this.authService.register(form.value.email, form.value.name, form.value.password, form.value.confirmPw).subscribe(
        data => {
          this.authService.login(form.value.email, form.value.password).subscribe(
              data1 => {
                  this.alertService.presentToast('Logged In');
              },
              error => {
                  console.log(error);
              },
              () => {
                  this.dismissRegister();
                  this.authService.isLoggedIn = true;
                  this.navCtrl.navigateRoot('/home');
              }
          );
          this.alertService.presentToast(data);
        },
        error => {
          console.log(error);
        },
        () => {

        }
    );
  }
}

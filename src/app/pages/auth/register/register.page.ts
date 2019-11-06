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
  validateFields(form: NgForm) {
    if (form.value.name !== '' && form.value.email !== '' && form.value.password !== '' && form.value.confirmPw !== '') {
      if (form.value.password === form.value.confirmPw) {
        return true;
      }
    }
    return false;
  }


  register(form: NgForm) {
    const validatedField = this.validateFields(form);
    if (validatedField) {
      this.authService.register(form.value.email, form.value.name, form.value.password, form.value.confirmPw).subscribe((res: any) => {
        console.log(res);
        if (res.status !== 'error') {
          this.authService.login(form.value.email, form.value.password).subscribe((d: any) => {
                if (d.status !== 'error') {
                  this.alertService.presentToast('Logged In');
                  this.dismissRegister();
                  this.authService.isLoggedIn = true;
                  this.navCtrl.navigateRoot('/home');
                }
              },
              error => {
                console.log(error);
              }
          );
        } else {
          this.alertService.presentToast(res.message);
        }
      });
    }
  }
}

    // this.authService.register(form.value.email, form.value.name, form.value.password, form.value.confirmPw).subscribe(
    //     data => {
    //       this.authService.login(form.value.email, form.value.password).subscribe(
    //           data1 => {
    //               this.alertService.presentToast('Logged In');
    //           },
    //           error => {
    //               console.log(error);
    //           },
    //           () => {
    //               this.dismissRegister();
    //               this.authService.isLoggedIn = true;
    //               this.navCtrl.navigateRoot('/home');
    //           }
    //       );
    //       this.alertService.presentToast(data);
    //     },
    //     error => {
    //       console.log(error);
    //     },
    //     () => {
    //
    //     }
    // );



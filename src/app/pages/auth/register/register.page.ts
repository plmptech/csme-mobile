import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {LoginPage} from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
   private ngForm: FormGroup;

  constructor(private modalCtrl: ModalController,
              private authService: AuthService,
              private navCtrl: NavController,
              private alertService: AlertService,
              public loadingCtrl: LoadingController,
              private  formBuilder: FormBuilder) {

    this.ngForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    }, {});

  }

  ngOnInit() {
  }

  goHome() {
    this.navCtrl.navigateForward('/home');
  }

  // On Login button tap, dismiss Register modal and open login Modal
  async loginModal() {
    const loginModal = await this.modalCtrl.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }
  validateFields(form: NgForm) {

    if (form.value.name !== '' && form.value.email !== '' && form.value.password !== '' && form.value.confirmPw !== '') {
      if (this.validateEmail(form.value.email)) {
        if (form.value.password === form.value.confirmPw) {
          return true;
        } else {
          this.alertService.presentToast('Password does not match');
        }
      } else {
        this.alertService.presentToast('Invalid email address');
      }
    }
    return false;
  }

  validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  showAutoHideLoader() {
    this.loadingCtrl.create({
      message: 'Registering account',
      duration: 3000,
      spinner: 'circles'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
  }

  register(form: NgForm) {
    const validatedField = this.validateFields(form);
    // console.log(form.value.email, form.value.name, form.value.mobile,
    //     form.value.password, form.value.confirmPw);
    // console.log(this.validateEmail(form.value.email));
    if (validatedField) {
      this.showAutoHideLoader();
      this.authService.register(form.value.email, form.value.name, form.value.mobile,
          form.value.password, form.value.confirmPw).subscribe((res: any) => {
        if (res.status !== 'error') {
          this.authService.login(form.value.email, form.value.password).subscribe((res: any) => {
                if (res.status !== 'error') {
                  localStorage.setItem('token', res.token);
                  this.loadingCtrl.dismiss();
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
          this.alertService.presentToast(res.message);
        }
      });
    } else {
      this.alertService.presentToast('Please fill in the required fields');
    }
  }
}

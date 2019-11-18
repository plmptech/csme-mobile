import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../services/env.service';
import {AlertService} from '../../services/alert.service';
import {Observable} from 'rxjs';

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
  public appPages: Array<Pages>;
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private authService: AuthService,
    private http: HttpClient,
    private env: EnvService,
    private alertService: AlertService, ) {
    this.appPages = [
      {
        title: 'MY LISTING',
        url: '/mylistings',
        direct: 'root',
        icon: 'list'
      },
    ];

    this.load();

   }

  async load() {
    if (!this.authService.isLoggedIn) {
      this.navCtrl.navigateRoot('/login');
      this.authService.clearStoredInfo();
      localStorage.clear();
    } else {
        this.res = await this.storage.get('currentUser');
        this.user = this.res.user;
      // localStorage.setItem('usertype',  this.res.user.type);
    }
  }

  async ngOnInit() {

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

    const body = {token: localStorage.getItem('token')};

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

}

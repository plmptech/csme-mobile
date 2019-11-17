import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../services/env.service';
import {AlertService} from '../../services/alert.service';

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
    private alertService: AlertService,
  ) {
    this.appPages = [
      {
        title: 'MY LISTING',
        url: '/mylistings',
        direct: 'root',
        icon: 'list'
      },
    ];
  }



  async ngOnInit() {
    this.authService.getUserInfo();
    this.res = await this.storage.get('currentUser');
    if (! this.res  || ! this.res.user) {
      this.navCtrl.navigateRoot('/home');
      this.authService.clearStoredInfo();
    }
    this.user =  this.res.user;
    console.log(this.user);
    localStorage.setItem('usertype',  this.res.user.type);
  }

  goToEditProfile() {
    this.navCtrl.navigateRoot('profile-edit');
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot('home');
  }

  upgradeUser() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.put(this.env.API_URL + 'user/' + this.res.user._id + '/upgrade', headers) .subscribe(
        response => {
          console.log(response);
          this.alertService.presentToast(response.message);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        });
  }

}

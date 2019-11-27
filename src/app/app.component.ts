import { Component } from '@angular/core';

import {MenuController, NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './services/auth.service';
import {AlertService} from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Business Listing',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'My Listing',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private authService: AuthService,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.menuCtrl.enable(true);
      this.splashScreen.hide();
    });
  }

  loginOrRegister() {
    console.log(localStorage)
    if (localStorage.getItem('token') !== null) {
      this.navCtrl.navigateRoot('landing');
      this.authService.isLoggedIn = true
      console.log('clearing token');
      //localStorage.clear();
      console.log('stored token: ' + localStorage.getItem('token'));

    } else {
      this.menuCtrl.enable(false);
      this.navCtrl.navigateRoot('landing');
    }

  }

}

import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.page.html',
  styleUrls: ['./profile-menu.page.scss'],
})
export class ProfileMenuPage implements OnInit {

  public appPages: Array<Pages>;
  constructor(
      private navCtrl: NavController
  ) {
    this.appPages = [
      {
        title: 'My Listings',
        url: '/mylistings',
        direct: 'root',
        icon: 'list'
      },
    ];
  }



  ngOnInit() {
  }



  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot('home');
  }

}

import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../services/auth.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  user: any;
  constructor(
      private navCtrl: NavController,
      private storage: Storage,
      private authService: AuthService,
  ) { }

  ngOnInit() {
    this.storage.get('currentUser').then(value => {
      console.log(value);
      if (value.status !== 'ok') {
        this.navCtrl.navigateRoot('/home');
        this.authService.clearStoredInfo();
      } else {
        this.user = value.user;
      }

    });
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }


}

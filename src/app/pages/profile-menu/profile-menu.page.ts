import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.page.html',
  styleUrls: ['./profile-menu.page.scss'],
})
export class ProfileMenuPage implements OnInit {
  user: any;
  public appPages: Array<Pages>;
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private authService: AuthService,
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
    this.authService.getUserInfo()
    const res = await this.storage.get('currentUser')
    if (!res || !res.user) {
      this.navCtrl.navigateRoot('/home')
      this.authService.clearStoredInfo()
    }
    this.user = res.user
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

}

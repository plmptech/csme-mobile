import { Component } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {LoginPage} from '../pages/auth/login/login.page';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private authService: AuthService, ) {}

  async openProfilePage() {
    this.navCtrl.navigateRoot('/login');

    const modal = await this.modalCtrl.create({
      component: LoginPage
    });
    return await modal.present();
  }


}

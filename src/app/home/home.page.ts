import { Component } from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {LoginPage} from '../pages/auth/login/login.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {}

  async openProfilePage() {
    this.navCtrl.navigateRoot('/login');

    const modal = await this.modalCtrl.create({
      component: LoginPage
    });
    return await modal.present();
  }


}

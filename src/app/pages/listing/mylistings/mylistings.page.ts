import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-mylistings',
  templateUrl: './mylistings.page.html',
  styleUrls: ['./mylistings.page.scss'],
})
export class MylistingsPage implements OnInit {

  constructor(
      private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  goHome() {
    this.navCtrl.navigateBack('/home');
  }
}

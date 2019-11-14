import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateBack('/mylistings');
  }

  submitListing() {

  }
}

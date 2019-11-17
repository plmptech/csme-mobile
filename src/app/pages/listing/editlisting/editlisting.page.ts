import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-editlisting',
  templateUrl: './editlisting.page.html',
  styleUrls: ['./editlisting.page.scss'],
})
export class EditlistingPage implements OnInit {
  id: number;
  name: string;
  type: string;
  country: string;
  city: string;
  description: string;
  revenue: number;
  cashflow: number;
  price: number;
  created: string;
  private age: any;

  constructor(private modalCtrl: ModalController,
              private navParams: NavParams,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.id = this.navParams.data.id;
    this.name = this.navParams.data.name;
    this.type = this.navParams.data.type;
    this.country = this.navParams.data.country;
    this.city = this.navParams.data.city;
    this.description = this.navParams.data.description;
    this.revenue = this.navParams.data.revenue;
    this.cashflow = this.navParams.data.cashflow;
    this.price = this.navParams.data.price;
    this.age = this.navParams.data.age;
    this.created = this.navParams.data.created;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  editListing() {

  }


}

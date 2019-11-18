import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.page.html',
  styleUrls: ['./listing-detail.page.scss'],
})
export class ListingDetailPage implements OnInit {

  id: number;
  name: string;
  purpose: string;
  country: string;
  city: string;
  description: string;
  revenue: number;
  cashflow: number;
  price: number;
  created: string;
  age: number;
  industry: string;

  constructor(private modalCtrl: ModalController,
              private navParams: NavParams,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.id = this.navParams.data.id;
    this.name = this.navParams.data.name;
    this.purpose = this.navParams.data.purpose;
    this.industry = this.navParams.data.industry;
    this.country = this.navParams.data.country;
    this.city = this.navParams.data.city;
    this.description = this.navParams.data.description;
    this.revenue = this.navParams.data.revenue;
    this.cashflow = this.navParams.data.cashFlow;
    this.price = this.navParams.data.askingPrice;
    this.age = this.navParams.data.age;
    this.created = this.navParams.data.created;

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


}

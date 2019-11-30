import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../services/env.service';

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
  photo: any;
  industry: string;
  email: string;

  constructor(private modalCtrl: ModalController,
    private navParams: NavParams,
    private http: HttpClient,
    private env: EnvService,
    private navCtrl: NavController) { }

  async ngOnInit() {
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
    this.photo = this.navParams.data.photo;
    this.created = this.navParams.data.created;

    this.http.get<User>(this.env.API_URL + 'user/info?id=' + this.navParams.data.user)
      .toPromise()
      .then((data: any) => {
        this.email = data.user.email
      })
  }

  enquiry(mail, email) {
    console.log(email)
    mail = document.createElement("a");
    mail.href = "mailto:" + email;
    mail.click();

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


}

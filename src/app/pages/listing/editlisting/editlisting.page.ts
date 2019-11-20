import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-editlisting',
  templateUrl: './editlisting.page.html',
  styleUrls: ['./editlisting.page.scss'],
})
export class EditlistingPage implements OnInit {
  id: number;
  name: string;
  purpose: string;
  industry: string;
  country: string;
  city: string;
  description: string;
  revenue: number;
  cashFlow: number;
  askingPrice: number;
  created: string;
  private age: any;

  constructor(private modalCtrl: ModalController,
              private navParams: NavParams,
              private navCtrl: NavController,
              private authService: AuthService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.id = this.navParams.data.id;
    console.log(this.id);
    this.name = this.navParams.data.name;
    this.purpose = this.navParams.data.purpose;
    this.industry = this.navParams.data.industry;
    this.country = this.navParams.data.country;
    this.city = this.navParams.data.city;
    this.description = this.navParams.data.description;
    this.revenue = this.navParams.data.revenue;
    this.cashFlow = this.navParams.data.cashFlow;
    this.askingPrice = this.navParams.data.askingPrice;
    this.age = this.navParams.data.age;
    this.created = this.navParams.data.created;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }



  saveListing(form: NgForm) {
    this.purpose = 'Business For Sale';
    const validatedField = this.validateForm(form);

    if (!validatedField) {
      this.alertService.presentToast('Please fill in the all fields');
    } else {
      this.authService.updateListingNow(form.value.name, this.purpose, this.industry, form.value.country, form.value.city,
          form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description,
          localStorage.getItem('token'), form.value.id).subscribe((res: any) => {
        if (res.status !== 'error') {
          console.log(res);
          this.modalCtrl.dismiss();
          this.alertService.presentToast(res.message);
          window.location.reload();
        } else {
          this.modalCtrl.dismiss();
          this.alertService.presentToast(res.message);
        }
      });
    }
  }

  validateForm(form: NgForm) {
    if (form.value.name !== '' && form.value.industry !== '' &&
        form.value.city !== '' && form.value.description !== '' && form.value.country !== ''
        && form.value.askingPrice !== undefined && form.value.age !== '' && form.value.cashFlow !== undefined
        && form.value.revenue !== undefined) {
      return true;
    }
    return false;
  }

}

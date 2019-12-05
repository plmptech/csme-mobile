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
  photo: any;

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
    this.photo = this.navParams.data.photo;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }



  saveListing(form: NgForm) {
    this.purpose = 'Business For Sale';
    const validatedField = this.validateForm(form);
    console.log('photo : ' +  this.photo);
    if (!validatedField) {

      this.alertService.presentToast('Please fill in all fields');
    } else {
      this.authService.updateListingNow(form.value.name, this.purpose, this.industry, form.value.country, form.value.city,
          form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description, this.photo,
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

  async upload(e) {
    return new Promise((resolve, reject) => {
      const input = e.target;
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        // const reader = new FileReader();
        // reader.readAsDataURL(input.files[0]);
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(input.files[0]);
        // Define a callback function to run, when FileReader finishes its job
        // reader.onload = f => {
        //   console.log(f.target);
        //   // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
        //   // Read image as base64 and set to imageData
        //   this.photo = f.target;
        //   // this.photo = f.target.result;
        //   resolve(this.photo);
        // };
        fileReader.onload = (event: Event) => {
          this.photo = fileReader.result;
          resolve(this.photo);
        };
      }
    });
  }

  validateForm(form: NgForm) {
    console.log(form.value.name, form.value.industry, form.value.city, form.value.description, form.value.country,
    form.value.askingPrice, form.value.age, form.value.cashFlow, form.value.revenue);
    if (form.value.name !== '' && form.value.industry !== '' &&
        form.value.city !== '' && form.value.description !== '' && form.value.country !== ''
        && form.value.askingPrice !== undefined && form.value.age !== undefined && form.value.cashFlow !== undefined
        && form.value.revenue !== undefined) {
      return true;
    }
    return false;
  }

}

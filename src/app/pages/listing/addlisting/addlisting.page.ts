import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {
  private purpose: string;
  private industry: string;
  private userTypeResult: boolean;
  private userType: string;

  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private alertService: AlertService) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateBack('/mylistings');
  }

  validateFields(form: NgForm) {
  }


  createListing(form: NgForm) {
    const validatedField = this.validateForm(form);
    this.purpose = 'Business For Sale';
    this.industry = form.value.category;
    console.log(form.value.name, this.purpose, this.industry, form.value.country, form.value.city,
        form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description,
        localStorage.getItem('token'));

    if (!validatedField) {
      this.alertService.presentToast('Please fill in the all fields');
    } else {
      this.authService.createListingNow(form.value.name, this.purpose, this.industry, form.value.country, form.value.city,
          form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description,
          localStorage.getItem('token')).subscribe((res: any) => {
        if (res.status !== 'error') {
          console.log(res);
          this.navCtrl.pop();
          this.alertService.presentToast(res.message);
        } else {
          this.navCtrl.pop();
          this.alertService.presentToast(res.message);
        }
      });
    }
  }

  validateForm(form: NgForm) {
    if (form.value.name !== '' && form.value.industry !== '' &&
        form.value.city !== '' && form.value.description !== '' && form.value.country !== ''
        && form.value.askingPrice !== '' && form.value.age !== '' && form.value.cashFlow !== '' && form.value.revenue !== '') {
        return true;
    }
    return false;
  }
}

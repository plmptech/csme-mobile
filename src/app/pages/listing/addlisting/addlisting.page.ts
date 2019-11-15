import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';
import {MylistingsPage} from '../mylistings/mylistings.page';
import {MylistingsPageModule} from '../mylistings/mylistings.module';

@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {

  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private alertService: AlertService,
      private myListingPage: MylistingsPage) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateBack('/mylistings');
  }

  validateFields(form: NgForm) {
  }


  createListing(form: NgForm) {
    const validatedField = this.validateForm(form);
    this.authService.createListingNow(form.value.name, form.value.type, form.value.category, form.value.city,
        form.value.description, form.value.price, form.value.age, form.value.cashflow,
        localStorage.getItem('token')).subscribe((res: any) => {
          if (res.status !== 'error') {
            console.log(res);
          } else {
            this.navCtrl.pop();
            this.alertService.presentToast(res.message);
          }
    });
  }

  validateForm(form: NgForm) {
    if (form.value.name !== '' && form.value.type !== '' && form.value.category !== '' &&
        form.value.city !== '' && form.value.description !== ''
        && form.value.price !== '' && form.value.age !== '' && form.value.cashflow !== '') {
        return true;
    }
    return false;
  }
}

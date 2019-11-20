import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit {
  public radiusmiles = 1;
  public minmaxprice = {
    upper: 10000000,
    lower: 10
  };

  dualRange: number;

  private selectCountry: string;
  private selectCity: string;
  private sortBy: string;
  private lowerPrice: number;
  private upperPrice: number;

  constructor(private modalCtrl: ModalController,
              ) { }

  ngOnInit() {
    this.selectCountry = '';
    this.selectCity = '';
    this.sortBy = '';
    this.minmaxprice.lower = 1;
    this.minmaxprice.upper = 10000000;
  }

  async applyChanges(form: NgForm) {
    console.log(form.value.selectCountry + ' ' + form.value.selectCity + ' ' + form.value.sortBy + ' ' +
        form.value.minmaxprice.lower + ' ' + form.value.minmaxprice.upper);

    this.minmaxprice.lower = form.value.minmaxprice.lower === null ?  form.value.minmaxprice.lower : this.minmaxprice.lower;
    this.minmaxprice.upper = form.value.minmaxprice.upper === null ? form.value.minmaxprice.upper : this.minmaxprice.upper;

    const onCloseData: any = {country: form.value.selectCountry, city: form.value.selectCity, sortBy: form.value.sortBy,
        lowerPrice: this.minmaxprice.lower , upperPrice: this.minmaxprice.upper};
    await this.modalCtrl.dismiss(onCloseData);

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


}

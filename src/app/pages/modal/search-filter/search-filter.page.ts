import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';

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

  private countries: any = [];
  private industries: any = [];
  private sortBy: string;
  private type: string;
  selectedIndustry: string;
  selectedCountry: string;
  // selectedCity: string;
  cities: any;
  private listOfCountryAndCity: any;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              private env: EnvService,
              private navParams: NavParams
  ) { }

  ngOnInit() {
    this.sortBy = '';
    this.minmaxprice.lower = 1;
    this.minmaxprice.upper = 10000000;
    this.getIndustries();
    this.getCountries();

    this.selectedIndustry = this.navParams.data.industry;
    this.selectedCountry = this.navParams.data.country;
    this.type = this.navParams.data.type;
    this.minmaxprice.lower = (this.navParams.data.priceLow === undefined) ? 1 : this.navParams.data.priceLow;
    this.minmaxprice.upper = (this.navParams.data.priceHigh === undefined) ? 10000000 : this.navParams.data.priceHigh;
    this.sortBy = this.navParams.data.sortBy;

  }

  resetFilter() {
    this.sortBy = '';
    this.minmaxprice.lower = 1;
    this.minmaxprice.upper = 10000000;
    this.selectedCountry = '';
    this.selectedIndustry = '';
  }

  getCountries() {
    this.http.get(this.env.API_URL + '/countries')
        .subscribe((res: any) => {
          console.log(res);
          for (let i = 0; i < res.totalCount; i++) {
            this.countries.push(res.countries[i].name);
          }
          console.log(this.countries);
        });

  }

  getIndustries() {
    this.http.get(this.env.API_URL + '/industries')
        .subscribe((res: any) => {
          console.log(res);
          console.log(res.totalCount);
          for (let x = 0; x < res.totalCount; x++) {
            this.industries.push(res.industries[x].name);
          }
          console.log(this.industries);
        });

  }

  async applyChanges() {
    console.log(this.selectedIndustry);
    console.log(this.selectedCountry);
    console.log(this.type);

    const onCloseData = {
      country: this.selectedCountry,
      industry: this.selectedIndustry,
      type: this.type,
      sortBy: this.sortBy,
      lowerPrice: this.minmaxprice.lower,
      upperPrice: this.minmaxprice.upper,
    };
    await this.modalCtrl.dismiss(onCloseData);

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


}

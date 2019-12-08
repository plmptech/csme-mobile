import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  private countries: any;
  private industries: any;
  private sortBy: string;
  private lowerPrice: number;
  private upperPrice: number;
  selectedIndustry: string;
  selectedCountry: string;
  selectedCity: string;
  cities: any;
  private listOfCountryAndCity: any;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              private env: EnvService,
  ) { }

  ngOnInit() {
    this.sortBy = '';
    this.minmaxprice.lower = 1;
    this.minmaxprice.upper = 10000000;

    this.getIndustries();
    this.getCountries();

  }

  getCountries() {
    this.http.get(this.env.API_URL + 'list/countries')
        .subscribe((res: any) => {
          console.log(res);
          this.listOfCountryAndCity = res.countries;
          this.countries = Object.keys(res.countries);
        });
  }

  getIndustries() {
    this.http.get(this.env.API_URL + 'list/industries')
        .subscribe((res: any) => {
          this.industries = res.industries;
        });
  }

  getCities() {
    this.cities = (this.listOfCountryAndCity)[this.selectedCountry];
  }

  async applyChanges() {
    console.log(this.selectedIndustry);
    console.log(this.selectedCountry);
    console.log(this.selectedCity);


    const onCloseData = {
      country: this.selectedCountry,
      city: this.selectedCity,
      industry: this.selectedIndustry,
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

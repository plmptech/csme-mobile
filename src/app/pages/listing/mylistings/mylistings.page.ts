/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EnvService } from '../../../services/env.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-mylistings',
  templateUrl: './mylistings.page.html',
  styleUrls: ['./mylistings.page.scss'],
})
export class MylistingsPage implements OnInit {

  resultList: any;
  businessListing;
  private ownListings: any;
  private ownListingCount: any;

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService,
  ) { }

  async ngOnInit() {
    this.getOwnListing();
  }

  getOwnListing() {
    this.ownListings = this.http.get(this.env.API_URL + 'user/listing?token=' + localStorage.getItem('token'))
        .toPromise()
        .then((data: any) => {
          console.log(data.user.listings);
          return data.user.listings;
        })
        .catch(err => {
          console.log('Error', err);
          return err;
        });
  }

  goHome() {
    this.navCtrl.navigateBack('/home');
  }

  openAddListing() {
    this.navCtrl.navigateForward('/addlisting');
  }
}

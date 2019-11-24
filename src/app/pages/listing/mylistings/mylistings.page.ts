/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { EnvService } from '../../../services/env.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ListingDetailPage } from '../../modal/listing-detail/listing-detail.page';
import { EditlistingPage } from '../editlisting/editlisting.page';

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
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
  }

  ionViewDidEnter() {
    this.getOwnListing();
  }

  getOwnListing() {
    this.ownListings = this.http.get(this.env.API_URL + 'user/listing?token=' + localStorage.getItem('token'))
      .toPromise()
      .then((data: any) => {
        for (let l of data.user.listings) {
          if (l.photo.data.length != 0) {
            let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(l.photo.data)))
            l.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String)
          }
          else
            l.photo = '/assets/shapes.svg'
        }
        console.log(data.user.listings)
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

  async openListingDetail(item: any) {
    console.log(item);
    const modal = await this.modalCtrl.create({
      component: EditlistingPage,
      componentProps: {
        id: item._id, name: item.name, purpose: item.purpose, age: item.age,
        industry: item.industry, created: item.created, country: item.country, city: item.city,
        revenue: item.revenue, askingPrice: item.askingPrice, cashFlow: item.cashFlow, description: item.description, user: item.user
      }
    });
    return await modal.present();
  }
}

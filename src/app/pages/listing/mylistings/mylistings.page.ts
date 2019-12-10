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

  //resultList: any;
  //businessListing;
  private ownListings: any;
  // private ownListingCount: any;

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

  convertImage(item) {
    let photo;
    if (item.data) {
      const bytes = new Uint8Array(item.data);
      const binary = bytes.reduce(
        (data, b) => (data += String.fromCharCode(b)), ''
      );
      photo = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + btoa(binary));
    } else {
      photo = '/assets/shapes.svg';
    }
    return photo;
  }

  getOwnListing() {
    this.ownListings = this.http.get(this.env.API_URL + 'user/listing?token=' + localStorage.getItem('token'))
      .toPromise()
      .then((data: any) => {
        for (let l of data.user.listings) {
          l.photo = this.convertImage(l.photo)
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
      componentProps: item
      // componentProps: {
      //   id: item._id, name: item.name, purpose: item.purpose, age: item.age,
      //   industry: item.industry, created: item.created, country: item.country, city: item.city,
      //   revenue: item.revenue, askingPrice: item.askingPrice, cashFlow: item.cashFlow, description: item.description, user: item.user
      // }
    });
    return await modal.present();
  }
}

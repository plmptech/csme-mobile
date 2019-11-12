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

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService,
  ) { }

  async ngOnInit() {
    this.http.get(this.env.API_URL + 'user/listing?token=' + localStorage.getItem('token')).subscribe(res => {
      if (res) {
        console.log(res)
        this.resultList = res.user.listings
      }
    })
  }

  goHome() {
    this.navCtrl.navigateBack('/home');
  }
}

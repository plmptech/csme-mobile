import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.page.html',
  styleUrls: ['./send-enquiry.page.scss'],
})
export class SendEnquiryPage implements OnInit {
  message: string;
  listingId: any;

  constructor(
      private navCtrl: NavController,
      public loadingCtrl: LoadingController,
      private http: HttpClient,
      private modalCtrl: ModalController,
      private alertService: AlertService,
      private authService: AuthService,
      private navParams: NavParams
  ) { }

  ngOnInit() {
    this.message = 'Hi there, I am interested in your business listing.';
    // this message needs to retrieve from api
    this.listingId = this.navParams.data.listingId;
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  sendEnquiry() {
      this.loadingCtrl.create({
        message: 'Submitting enquiry',
        duration: 3000,
        spinner: 'circles'
      }).then((res) => {
        res.present();

        this.authService.sendEmail(this.message, this.listingId, localStorage.getItem('token')).subscribe((ress: any) => {
          if (ress.status !== 'error') {
            console.log(ress);
            this.loadingCtrl.dismiss();
            // this.alertService.presentToast(ress.message);

          } else {
            this.loadingCtrl.dismiss();
            this.modalCtrl.dismiss();
            // this.alertService.presentToast(ress.message);
          }
        });
      });
    }
}

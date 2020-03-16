import { Component, OnInit } from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';
import {EnvService} from '../../../services/env.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-send-enquiry',
  templateUrl: './send-enquiry.page.html',
  styleUrls: ['./send-enquiry.page.scss'],
})
export class SendEnquiryPage implements OnInit {
  msg: string;
  listingId: any;
  enquirymessage: any;

  constructor(
      private navCtrl: NavController,
      public loadingCtrl: LoadingController,
      private http: HttpClient,
      private modalCtrl: ModalController,
      private alertService: AlertService,
      private authService: AuthService,
      private navParams: NavParams,
      private env: EnvService,
  ) { }

  ngOnInit() {
    // this.enquirymessage = this.getEnquiryMsg();
    // this message needs to retrieve from api
    this.listingId = this.navParams.data.listingId;
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  // getEnquiryMsg() {
  //   return this.http.get(this.env.API_URL + 'setting?token=' + localStorage.getItem('token'))
  //       .subscribe((res: any) => {
  //         console.log(res.s.enquiryMessage);
  //         this.message = res.s.enquiryMessage;
  //   });
  // }
  sendEnquiry(form: NgForm) {
    this.loadingCtrl.create({
        message: 'Submitting enquiry',
        duration: 3000,
        spinner: 'circles'
      }).then((res) => {
        res.present();
      });

    console.log(form.value.msg);
    this.authService.sendEmail(form.value.msg, this.listingId, localStorage.getItem('token')).subscribe((ress: any) => {
      if (ress.status === 'ok') {
        console.log(ress);
        this.loadingCtrl.dismiss();
        this.modalCtrl.dismiss();
        this.alertService.presentToast('Enquiry sent!');

      } else {
        this.loadingCtrl.dismiss();
        this.modalCtrl.dismiss();
        this.alertService.presentToast('Unable to send enquiry, please contact admin.');
      }
    });
    }
}

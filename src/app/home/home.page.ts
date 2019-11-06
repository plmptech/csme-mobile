import {Component, OnInit} from '@angular/core';
import {MenuController, ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {LoginPage} from '../pages/auth/login/login.page';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {
  cardItems: any[];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private authService: AuthService,
              private menuCtrl: MenuController) {
    this.cardItems = [

      {
        user_avtar: 'assets/img/marty-avatar.png',
        user_name: 'Marty McFly',
        date: 'November 5, 1955',
        image: 'assets/img/advance-card-bttf.png',
        content: 'Wait a minute. Wait a minute, Doc. Uhhh.... out of a DeLorean?! Whoa. This is heavy.',
      },
      {
        user_avtar: 'assets/img/sarah-avatar.png.jpeg',
        user_name: 'Sarah Connor',
        date: 'May 12, 1984',
        image: 'assets/img/advance-card-tmntr.jpg',
        content: 'I face the unknown future, wialue of human life, maybe we can too.'
      },
      {
        user_avtar: 'assets/img/ian-avatar.png',
        user_name: 'Dr. Ian Malcolm',
        date: 'June 28, 1990',
        image: 'assets/img/advance-card-jp.jpg',
        content: 'Your scientists were y didn\'t stop to think if they should.'
      }
    ];
  }

  ngOnInit() {
      this.menuCtrl.enable(true);
  }

  // async openProfilePage() {
  //   this.navCtrl.navigateRoot('/login');
  //
  //   const modal = await this.modalCtrl.create({
  //     component: LoginPage
  //   });
  //   return await modal.present();
  // }


}

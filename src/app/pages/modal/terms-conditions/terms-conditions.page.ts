import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {
  // public loginForm: FormGroup;
  // name = new FormControl('');

  constructor(private modalCtrl: ModalController,
              private formBuilder: FormBuilder) {

    // this.loginForm = this.formBuilder.group({
    //   username: new FormControl('', Validators.compose([
    //     Validators.required
    //   ])),
    //   password: new FormControl('', Validators.compose([
    //     Validators.required
    //   ]))
    // });
  }

  ngOnInit() {
  }

  goBack() {
    this.modalCtrl.dismiss();
  }


}

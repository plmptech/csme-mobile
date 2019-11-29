import { Component, OnInit } from '@angular/core';
import {ActionSheetController, NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';
import {NgForm} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {
  private purpose: string;
  private industry: string;
  private userTypeResult: boolean;
  private userType: string;

  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private camera: Camera,
      public actionSheetController: ActionSheetController,
      private alertService: AlertService) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateBack('/mylistings');
  }

  validateFields(form: NgForm) {
  }

  upload(event) {
    console.log(event.detail.value);
  }

  createListing(form: NgForm) {
    const validatedField = this.validateForm(form);
    this.purpose = 'Business For Sale';
    this.industry = form.value.category;
    console.log(form.value.imageFilePath);

    if (!validatedField) {
      this.alertService.presentToast('Please fill in the all fields');
    } else {
      this.authService.createListingNow(form.value.name, this.purpose, this.industry, form.value.country, form.value.city,
          form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description,
          localStorage.getItem('token')).subscribe((res: any) => {
        if (res.status !== 'error') {
          console.log(res);
          this.navCtrl.pop();
          this.alertService.presentToast(res.message);
        } else {
          this.navCtrl.pop();
          this.alertService.presentToast(res.message);
        }
      });
    }
  }

  validateForm(form: NgForm) {
    if (form.value.name !== '' && form.value.industry !== '' &&
        form.value.city !== '' && form.value.description !== '' && form.value.country !== ''
        && form.value.askingPrice !== '' && form.value.age !== '' && form.value.cashFlow !== '' && form.value.revenue !== '') {
        return true;
    }
    return false;
  }


  pickImage(s) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: s,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
       const base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}

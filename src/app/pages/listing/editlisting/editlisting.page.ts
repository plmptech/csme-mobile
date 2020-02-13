import {Component, OnInit, SecurityContext} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  PopoverController
} from '@ionic/angular';
import {NgForm} from '@angular/forms';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';
import {IImage, ImageCompressService} from 'ng2-image-compress';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';

@Component({
  selector: 'app-editlisting',
  templateUrl: './editlisting.page.html',
  styleUrls: ['./editlisting.page.scss'],
})
export class EditlistingPage implements OnInit {
  id: string;
  name: string;
  purpose: string;
  industries: any = [];
  countries: any = [];
  city: string;
  description: string;
  revenue: number;
  cashFlow: number;
  askingPrice: number;
  created: string;
  private age: any;
  photo: any;
  selectedIndustry: string;
  selectedCountry: string;
  selectedCity: string;
  cities: any;
  private listOfCountryAndCity: any;
  processedImages: any = [];

  constructor(private modalCtrl: ModalController,
              private navParams: NavParams,
              private navCtrl: NavController,
              private sanitizer: DomSanitizer,
              private authService: AuthService,
              private alertService: AlertService,
              private alertCtrl: AlertController,
              private http: HttpClient,
              private env: EnvService,
              public loadingCtrl: LoadingController,
              public popoverCtrl: PopoverController,
              private camera: Camera,
              private  actionSheetController: ActionSheetController) {


  }

  ngOnInit() {
    this.getIndustries();
    this.getCountries();
    this.id = this.navParams.data._id;
    this.name = this.navParams.data.name;
    this.purpose = this.navParams.data.purpose;
    this.selectedIndustry = this.navParams.data.industry;
    this.selectedCountry = this.navParams.data.country;
    this.selectedCity = this.navParams.data.city;
    // console.log(this.selectedCountry, this.selectedCountry, this.selectedCity);
    this.description = this.navParams.data.description;
    this.revenue = this.navParams.data.revenue;
    this.cashFlow = this.navParams.data.cashFlow;
    this.askingPrice = this.navParams.data.askingPrice;
    this.age = this.navParams.data.age;
    this.created = this.navParams.data.created;
    this.photo = this.convertImage(this.navParams.data.photo);

    // if (this.navParams.data.photo.data !== 0) {
    //   const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(this.navParams.data.photo.data)));
    //   this.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String);
    // } else {
    //   this.photo = '/assets/shapes.svg';
    // }


    // console.log(this.photo);

  }

  async showConfirmAlert() {
    const alert =  await this.alertCtrl.create({
      message: 'Do you wish to delete this listing?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            const text = 'listing/' + this.id;
            this.http.delete<ReturnMessage>(this.env.API_URL + text + '?token=' + localStorage.getItem('token')).subscribe(
                response => {
                  console.log(response);
                  if (response.status === 'ok') {
                    this.alertService.presentToast('Listing has been deleted');
                    this.modalCtrl.dismiss();
                    this.navCtrl.navigateRoot('/profile-menu');
                    location.reload();

                  } else {
                    this.alertService.presentToast(response.status);
                  }

                },
                error => {
                  console.log(error.text());
                  this.alertService.presentToast(error.text);
                });

          }
        }
      ]
    });
    await alert.present();
  }

  getCountries() {
    this.http.get(this.env.API_URL + '/countries')
        .subscribe((res: any) => {
          console.log(res);
          for (let i = 0; i < res.totalCount; i++) {
            this.countries.push(res.countries[i].name);
          }
          console.log(this.countries);
        });
  }

  getIndustries() {
    this.http.get(this.env.API_URL + '/industries')
        .subscribe((res: any) => {
          console.log(res);
          console.log(res.totalCount);
          for (let x = 0; x < res.totalCount; x++) {
            this.industries.push(res.industries[x].name);
          }
          console.log(this.industries);
        });
  }

  // getCities() {
  //   this.cities = (this.listOfCountryAndCity)[this.selectedCountry];
  // }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  convertImage(item) {

    if (item.data) {
      const bytes = new Uint8Array(item.data);
      const binary = bytes.reduce(
          (data, b) => (data += String.fromCharCode(b)),
          ''
      );
      this.photo = 'data:image/*;base64,' + btoa(binary);
      return this.photo;
    } else {
      return item;
    }
  }

  saveListing(form: NgForm) {
    this.purpose = 'Business For Sale';
    const validatedField = this.validateForm(form);
    // console.log('photo : ' +  this.photo);
    console.log(form.value.selectedCity);

    //
    if (!validatedField) {
      this.alertService.presentToast('Please fill in all fields');
    } else {
      this.showAutoHideLoader();
      this.authService.updateListingNow(form.value.name, this.purpose, form.value.selectedIndustry, form.value.selectedCountry,
      form.value.selectedCity,
          form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description, this.photo,
          localStorage.getItem('token'), this.id).subscribe((res: any) => {
        if (res.status !== 'error') {
          console.log(res);
          this.modalCtrl.dismiss();
          this.alertService.presentToast(res.message);
          window.location.reload();
        } else {
          this.modalCtrl.dismiss();
          this.alertService.presentToast(res.message);
        }
      });
    }
  }

  // async upload(e) {
  //   return new Promise((resolve, reject) => {
  //     const input = e.target;
  //     if (input.files && input.files[0]) {
  //       // create a new FileReader to read this image and convert to base64 format
  //       // const reader = new FileReader();
  //       // reader.readAsDataURL(input.files[0]);
  //       const fileReader: FileReader = new FileReader();
  //       fileReader.readAsDataURL(input.files[0]);
  //       // Define a callback function to run, when FileReader finishes its job
  //       // reader.onload = f => {
  //       //   console.log(f.target);
  //       //   // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
  //       //   // Read image as base64 and set to imageData
  //       //   this.photo = f.target;
  //       //   // this.photo = f.target.result;
  //       //   resolve(this.photo);
  //       // };
  //       fileReader.onload = (event: Event) => {
  //         this.photo = fileReader.result;
  //         resolve(this.photo);
  //       };
  //     }
  //   });
  // }
  // old method
  onUpload(fileInput: any) {
    // let fileList: FileList;
    const images: Array<IImage> = [];

    ImageCompressService.filesToCompressedImageSource(fileInput.target.files).then(observableImages => {
      observableImages.subscribe((image) => {
        images.push(image);
        // console.log(images);
        // console.log(images[0].compressedImage.imageDataUrl);
        this.photo = images[0].compressedImage.imageDataUrl;

      }, (error) => {
        console.log('Error while converting');
      }, () => {
        this.processedImages = images;
      });
    });

  }

  showAutoHideLoader() {
    this.loadingCtrl.create({
      message: 'Saving listing',
      duration: 3000,
      spinner: 'circles'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
      });
    });
  }

  validateForm(form: NgForm) {
    console.log(form.value.name, form.value.selectedIndustry, form.value.selectedCity, form.value.description, form.value.selectedCountry,
        form.value.askingPrice, form.value.age, form.value.cashFlow, form.value.revenue);
    if (form.value.name !== '' && form.value.selectedIndustry !== '' &&
        form.value.selectedCity !== '' && form.value.description !== '' && form.value.selectedCountry !== ''
        && form.value.askingPrice !== undefined && form.value.age !== undefined && form.value.cashFlow !== undefined
        && form.value.revenue !== undefined) {
      return true;
    }
    return false;
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.chooseImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
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

  takePhoto(s) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      sourceType: s,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
    }, err => {
      console.log(err);
    });
  }

  chooseImage(x) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: x,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imageData) => {
      this.photo = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });

  }

}

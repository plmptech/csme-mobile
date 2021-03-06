import { Component, OnInit } from '@angular/core';
import {ActionSheetController, LoadingController, NavController, NavParams, Platform  } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';
import {IImage, ImageCompressService} from 'ng2-image-compress';
import {DomSanitizer} from '@angular/platform-browser';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss']
})
export class AddlistingPage implements OnInit {
  private purpose: string;
  private photo: any;
  // group: FormGroup;
  industries: any = [];
  countries: any = [];
  selectedIndustry: string;
  selectedCountry: string;
  selectedCity: string;
  processedImages: any = [];
  private ngForm: FormGroup;
  private file: any;
  private destination: any;
  pickedImage: any;
  imageurlfrompicker: any;
  imageurlfromresizer: any;
  private tempPhoto: any;
  smallSize: any;
  private bigSize: any;

  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private camera: Camera,
      private alertService: AlertService,
      private imgCompressService: ImageCompressService,
      private http: HttpClient,
      private env: EnvService,
      public loadingCtrl: LoadingController,
      public formBuilder: FormBuilder,
      private sanitizer: DomSanitizer,
      private actionSheetController: ActionSheetController,
      public platform: Platform,
      // private imageResizer: ImageResizer,
  ) {

    // this.ngForm = new FormGroup({
    //   name : new FormControl('', [Validators.required, Validators.maxLength(50)]),
    //   // industry : new FormControl('', [Validators.required, Validators.maxLength(25)]),
    //   // country : new FormControl('', [Validators.required, Validators.maxLength(25)]),
    //   // city : new FormControl('', [Validators.required, Validators.maxLength(25)]),
    //   age : new FormControl('', [Validators.required, Validators.min(1), Validators.max(30) ]),
    //   description : new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(500) ]),
    //   askingPrice : new FormControl('', [Validators.required, Validators.min(100), Validators.max(99999999) ]),
    //   revenue : new FormControl('', [Validators.required, Validators.min(100), Validators.max(99999999) ]),
    //   cashFlow : new FormControl('', [Validators.required, Validators.min(100), Validators.max(99999999) ]),
    //
    // });

  }

  async ngOnInit() {
    this.getIndustries();
    this.getCountries();
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

  goBack() {
    this.navCtrl.navigateBack('/profile-menu');
  }

  // old way of uploading and resizing, dont remove
  onUpload(fileInput: any) {
    // let fileList: FileList;
    this.alertService.presentToast(fileInput.target.files);
    console.log(fileInput.target.files);
    const images: Array<IImage> = [];

    ImageCompressService.filesToCompressedImageSource(fileInput.target.files).then(observableImages => {
      observableImages.subscribe((image) => {
        images.push(image);
        // console.log(images);
        // console.log(images[0].compressedImage.imageDataUrl);
        this.photo = images[0].compressedImage.imageDataUrl;

      }, (err) => {
        console.log('Error while converting');
      }, () => {
        this.processedImages = images;
      });
    });

  }
  // async upload(e) {
  //   return new Promise((resolve, reject) => {
  //     const input = e.target;
  //     if (input.files && input.files[0]) {
  //       // create a new FileReader to read this image and convert to base64 format
  //       // const reader = new FileReader();
  //       const fileReader: FileReader = new FileReader();
  //       fileReader.readAsDataURL(input.files[0]);
  //       console.log(input.files[0]);
  //       // Define a callback function to run, when FileReader finishes its job
  //       // reader.onload = f => {
  //       //   console.log(f.target);
  //       //   // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
  //       //   // Read image as base64 and set to imageData
  //       //   // this.photo = f.target;
  //       //   this.photo = f.target.result;
  //       //   resolve(this.photo);
  //       // };
  //
  //       fileReader.onload = (event: Event) => {
  //
  //           this.photo = fileReader.result;
  //           // console.log(fileReader.result);
  //           resolve(this.photo);
  //       };
  //     }
  //   });
  // }


  createListing(form: NgForm) {
    const validatedField = this.validateForm(form);
    this.purpose = 'Business For Sale';

    if (!validatedField) {
      this.alertService.presentToast('Please fill in the all fields');
    } else {

      this.loadingCtrl.create({
        message: 'Submitting enquiry',
        duration: 5000,
        spinner: 'circles'
      }).then((ress) => {
        ress.present();
      });

      this.authService.createListingNow(form.value.name, this.purpose, this.selectedIndustry, this.selectedCountry,
          form.value.selectedCity, form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow,
          form.value.description, this.photo,
          localStorage.getItem('token')).subscribe((res: any) => {
        if (res.status !== 'error') {
          console.log(res);
          this.navCtrl.pop();
          this.loadingCtrl.dismiss();
          this.alertService.presentToast(res.message);
        } else {
          this.navCtrl.pop();
          this.loadingCtrl.dismiss();
          this.alertService.presentToast(res.message);
        }
      });
    }
  }

  validateForm(form: NgForm) {
    if (form.value.name !== '' && this.selectedIndustry !== '' &&
        this.selectedCity !== '' && form.value.description !== '' && this.selectedCountry !== ''
        && form.value.askingPrice !== '' && form.value.age !== '' && form.value.cashFlow !== '' && form.value.revenue !== '') {
      return true;
    }
    return false;
  }


  takePhoto(s) {
    const options: CameraOptions = {
      quality: 100,
      // targetWidth: 100,
      // targetHeight: 100,
      sourceType: s,
      destinationType: this.camera.DestinationType.DATA_URL,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imageData) => {
      console.log('here');
      console.log(imageData);
      // this.photo = 'data:image/jpeg;base64,' + imageData;
      this.tempPhoto = 'data:image/jpeg;base64,' + imageData;
      this.bigSize = this.getImageSize(this.tempPhoto);
      this.generateFromImage(this.tempPhoto, 200, 200, 1.0, data => {
           this.photo = data;
           this.smallSize = this.getImageSize(this.photo);
      });

      });
  }

  generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    const canvas: any = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0, width, height);

      // IMPORTANT: 'jpeg' NOT 'jpg'
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl);
    }
    image.src = img;
  }

  getImageSize(dataUrl) {
    const head = 'data:image/jpeg;base64,';
    return ((dataUrl.length - head.length) * 3 / 4 / (1024 * 1024)).toFixed(4);
  }

  getPlatform() {
    if (this.platform.is('ios')) {
      this.destination = this.camera.DestinationType.NATIVE_URI;
    } else if (this.platform.is('android')) {
      this.destination = this.camera.DestinationType.FILE_URI;
    } else {
      this.destination = this.camera.DestinationType.DATA_URL;
    }
  }
  chooseImage(x) {
    const options: CameraOptions = {
      quality: 100,
      // targetWidth: 100,
      // targetHeight: 100,
      destinationType: this.camera.DestinationType.DATA_URL, // this.camera.DestinationType.DATA_URL,
      sourceType: x,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      // this.photo = 'data:image/jpeg;base64,' + imageData;
      this.tempPhoto = 'data:image/jpeg;base64,' + imageData;
      this.bigSize = this.getImageSize(this.tempPhoto);
      this.generateFromImage(this.tempPhoto, 200, 200, 1.0, data => {
        this.photo = data;
        this.smallSize = this.getImageSize(this.photo);
      });

    }, (err) => {
      console.log(err);
    });

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
}

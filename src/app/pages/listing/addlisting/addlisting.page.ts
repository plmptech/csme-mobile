import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';

@Component({
  selector: 'app-addlisting',
  templateUrl: './addlisting.page.html',
  styleUrls: ['./addlisting.page.scss'],
})
export class AddlistingPage implements OnInit {
  private purpose: string;
  // private userTypeResult: boolean;
  // private userType: string;
  private photo: any;
  group: FormGroup;
  industries: any;
  countries: any;
  cities: any;
  selectedIndustry: string;
  selectedCountry: string;
  selectedCity: string;
  private listOfCountryAndCity: any;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private alertService: AlertService,
    private http: HttpClient,
    private env: EnvService) { }

  async ngOnInit() {
    // this.group = new FormGroup({
    //   businessName : new FormControl('', [Validators.required, Validators.maxLength(50)]),
    //   industry : new FormControl('', [Validators.required, Validators.maxLength(25)]),
    //   country : new FormControl('', [Validators.required, Validators.maxLength(25)]),
    //   city : new FormControl('', [Validators.required, Validators.maxLength(25)]),
    //   yearsInBiz : new FormControl('', [Validators.required, Validators.min(1), Validators.max(30) ]),
    //   description : new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(500) ]),
    //   askingPrice : new FormControl('', [Validators.required, Validators.min(100), Validators.max(99999999) ]),
    //   revenue : new FormControl('', [Validators.required, Validators.min(100), Validators.max(99999999) ]),
    //   cashFlow : new FormControl('', [Validators.required, Validators.min(100), Validators.max(99999999) ]),
    //
    // });
    this.getIndustries();
    this.getCountries();
  }

  getCountries() {
    this.http.get(this.env.API_URL + 'list/countries')
        .subscribe((res: any) => {
          console.log(res);
          this.listOfCountryAndCity = res.countries;
          this.countries = Object.keys(res.countries);
        });
  }

  getIndustries() {
    this.http.get(this.env.API_URL + 'list/industries')
        .subscribe((res: any) => {
          this.industries = res.industries;
        });
  }

  getCities() {
    this.cities = (this.listOfCountryAndCity)[this.selectedCountry];
  }

  goBack() {
    this.navCtrl.navigateBack('/mylistings');
  }

  async upload(e) {
    return new Promise((resolve, reject) => {
      const input = e.target;
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        // const reader = new FileReader();
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(input.files[0]);
        // Define a callback function to run, when FileReader finishes its job
        // reader.onload = f => {
        //   console.log(f.target);
        //   // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
        //   // Read image as base64 and set to imageData
        //   // this.photo = f.target;
        //   this.photo = f.target.result;
        //   resolve(this.photo);
        // };
        fileReader.onload = (event: Event) => {
            this.photo = fileReader.result;
            resolve(this.photo);
        };
      }
    });
  }

  createListing(form: NgForm) {
    const validatedField = this.validateForm(form);
    this.purpose = 'Business For Sale';
    console.log(this.selectedCountry, this.selectedCity, this.selectedIndustry);

    if (!validatedField) {
      this.alertService.presentToast('Please fill in the all fields');
    } else {
      this.authService.createListingNow(form.value.name, this.purpose, this.selectedIndustry, this.selectedCountry, this.selectedCity,
        form.value.age, form.value.askingPrice, form.value.revenue, form.value.cashFlow, form.value.description, this.photo,
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
    if (form.value.name !== '' && this.selectedIndustry !== '' &&
      this.selectedCity !== '' && form.value.description !== '' && this.selectedCountry !== ''
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
      this.photo = base64Image;
      this.alertService.presentToast(this.photo);
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

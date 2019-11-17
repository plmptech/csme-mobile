import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {LoginPageModule} from './pages/auth/login/login.module';
import {RegisterPageModule} from './pages/auth/register/register.module';
import {AuthGuard} from './guard/auth.guard';
import {AuthService} from './services/auth.service';
import {HomePageModule} from './home/home.module';
import {LandingPageModule} from './pages/landing/landing.module';
import {SearchFilterPageModule} from './pages/modal/search-filter/search-filter.module';
import {NativeStorage} from '@ionic-native/native-storage';
import {IonicStorageModule} from '@ionic/storage';
import {MylistingsPageModule} from './pages/listing/mylistings/mylistings.module';
import {AddlistingPage} from './pages/listing/addlisting/addlisting.page';
import {AddlistingPageModule} from './pages/listing/addlisting/addlisting.module';
import {ListingDetailPageModule} from './pages/modal/listing-detail/listing-detail.module';
import {EditlistingPageModule} from './pages/listing/editlisting/editlisting.module';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        LoginPageModule,
        RegisterPageModule,
        HomePageModule,
        LandingPageModule,
        SearchFilterPageModule,
        MylistingsPageModule,
        AddlistingPageModule,
        ListingDetailPageModule,
        EditlistingPageModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AuthGuard,
        AuthService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

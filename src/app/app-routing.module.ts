import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'landing', loadChildren: './pages/landing/landing.module#LandingPageModule' },
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule'},
  { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'search-filter', loadChildren: './pages/modal/search-filter/search-filter.module#SearchFilterPageModule' },
  { path: 'profile-menu', loadChildren: './pages/profile-menu/profile-menu.module#ProfileMenuPageModule' },
  { path: 'mylistings', loadChildren: './pages/listing/mylistings/mylistings.module#MylistingsPageModule' },
  { path: 'addlisting', loadChildren: './pages/listing/addlisting/addlisting.module#AddlistingPageModule' },
  { path: 'profile-edit', loadChildren: './pages/profile-edit/profile-edit.module#ProfileEditPageModule' },
  { path: 'listing-detail', loadChildren: './pages/modal/listing-detail/listing-detail.module#ListingDetailPageModule' },
  { path: 'editlisting', loadChildren: './pages/listing/editlisting/editlisting.module#EditlistingPageModule' },
  { path: 'send-enquiry', loadChildren: './pages/modal/send-enquiry/send-enquiry.module#SendEnquiryPageModule' },
  { path: 'terms-conditions', loadChildren: './pages/modal/terms-conditions/terms-conditions.module#TermsConditionsPageModule' },
  { path: 'forgotpassword', loadChildren: './pages/auth/forgotpassword/forgotpassword.module#ForgotpasswordPageModule' },
  { path: 'changepassword', loadChildren: './pages/auth/changepassword/changepassword.module#ChangepasswordPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import {Routes} from '@angular/router';
import {SigninComponent} from './components/signin/signin.component';
import {SignupComponent} from "./components/signup/signup.component";
import {HomeComponent} from "./components/home/home.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'sign-in', component: SigninComponent
  },
  {
    path: 'sign-up', component: SignupComponent
  },
  {
    path:'dashboard',component:DashboardComponent
  }
];

import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import {SignupComponent} from "./components/signup/signup.component";
import {HomeComponent} from "./components/home/home.component";

export const routes: Routes = [
  {
   path:'' , component:SigninComponent
  },
  {
    path:'sign-up',component:SignupComponent
  },
  {
    path:'home' ,component:HomeComponent
  }
];

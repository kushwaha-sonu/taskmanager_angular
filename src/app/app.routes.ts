import {Routes} from '@angular/router';
import {SigninComponent} from './components/signin/signin.component';
import {SignupComponent} from "./components/signup/signup.component";
import {HomeComponent} from "./components/home/home.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {CreatetaskComponent} from "./components/createtask/createtask.component";
import {EdittaskComponent} from "./components/edittask/edittask.component";
import {HistoryComponent} from "./components/history/history.component";

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
    path:'dashboard',component:DashboardComponent,
    children:[
      {
        path:'history',component:HistoryComponent
      }
    ]
  },
  {
    path:'create-task',component:CreatetaskComponent
  },
  {
    path:'edit-task/:id',component:EdittaskComponent
  }

];

import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {getUserDataFromLocalStore} from "../../store";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user =getUserDataFromLocalStore();
  constructor(private router: Router) {

  }



  redirectToSignInPage() {

    if (!this.user) {


      this.router.navigate(['/sign-in']).then(() => {
        // window.location.reload();
      });
      return;
    } else {
      this.router.navigate(['/dashboard']).then(() => {
        // window.location.reload();
      });
      return;
    }


  }

}

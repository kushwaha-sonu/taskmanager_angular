import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {getUserDataFromLocalStore, removeUserDataFromLocalStore} from "../../store";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgOptimizedImage,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isMenuBarClicked: boolean = false;
  user: User | null;
  constructor(private router: Router ) {
    this.user = getUserDataFromLocalStore();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  isDashActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }




  redirectToLoginPage() {
    // Redirect to login page
    this.router.navigate(['/sign-in']).then(() => {
      this.isMenuBarClicked = false;
    });

  }

  redirectToHomePage() {
    // Redirect to signup page
    this.router.navigate(['']).then(() => {
      this.isMenuBarClicked = false;
    });
  }

  redirectToCreatePage() {
    // Redirect to signup page
    this.router.navigate(['/create-task']).then(() => {
      // window.location.reload();
      this.isMenuBarClicked = false;
    });
  }

  redirectToDashboardPage() {
    // Redirect to signup page
    this.router.navigate(['/dashboard']).then(() => {
      this.isMenuBarClicked = false;

    })

  }

  onLogOut() {
    // Remove user data from local storage
    this.router.navigate(['']).then(() => {
      this.isMenuBarClicked = false;
      this.user=removeUserDataFromLocalStore();
      window.location.reload();


    });


  }

  menuBarClick() {
    this.isMenuBarClicked = !this.isMenuBarClicked;

  }


}


interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

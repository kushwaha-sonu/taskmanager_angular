import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router) { }

  redirectToLoginPage(){
    // Redirect to login page
    this.router.navigate(['/sign-in']);

  }

    redirectToHomePage(){
    // Redirect to signup page
    this.router.navigate(['']);
  }}

import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';


import {AsyncPipe, CommonModule} from "@angular/common";
import {NavbarComponent} from "./components/navbar/navbar.component";
import  {FooterComponent} from "./components/footer/footer.component";









@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, CommonModule, NavbarComponent,FooterComponent,

  CommonModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})





export class AppComponent {



}

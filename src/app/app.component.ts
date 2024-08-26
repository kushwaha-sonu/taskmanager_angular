import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Observable} from "rxjs";
import {collection, collectionData, Firestore,doc, setDoc} from "@angular/fire/firestore";
import {Auth, createUserWithEmailAndPassword, signInWithPopup,GoogleAuthProvider} from "@angular/fire/auth";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, CommonModule} from "@angular/common";
import {NavbarComponent} from "./components/navbar/navbar.component";


interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})





export class AppComponent {
  title = 'Taskmanager';

  signupForm: FormGroup;
  auth: Auth = inject(Auth);


  firestore: Firestore = inject(Firestore);
  users$: Observable<User[]>;

  constructor(private fb: FormBuilder) {


    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });


    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData<User>(usersCollection)



  }


  onSubmit() {
    if (this.signupForm.valid) {
      const {email, password} = this.signupForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(userCredential => {
          console.log('User signed up:', userCredential);
        })
        .catch(error => {
          console.error('Error signing up:', error);
        });
    }

  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      const userRef = doc(this.firestore, `users/${user.uid}`);
     await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });

      console.log('User logged in with Google:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  }


}

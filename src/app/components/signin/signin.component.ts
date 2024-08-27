// src/app/components/signin/signin.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, UserCredential } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {getUserDataFromLocalStore, setUserDataToLocalStore} from "../../store";


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signinForm: FormGroup;
  auth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  toaster: ToastrService = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });


  }

  redirectToSignupPage() {
    this.router.navigate(['/sign-up']);
  }

  signInWithEmail() {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;
      signInWithEmailAndPassword(this.auth, email, password)
        .then(userCredential => {
          this.router.navigate(['/dashboard']).then(() => {
            this.toaster.success('User signed in successfully');

            setUserDataToLocalStore({
              email: userCredential.user.email as string,
              displayName: userCredential.user.displayName as string,
              photoURL: userCredential.user.photoURL as string,
              uid: userCredential.user.uid
            })


            window.location.reload();



          });
        })
        .catch(error => {
          if (error.code === 'auth/invalid-credential') {
            this.toaster.error('Invalid credentials');
          } else {
            this.toaster.error('Error signing in:');
          }
          console.error('Error signing in:', error);
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

      this.router.navigate(['/dashboard']).then(() => {

          setUserDataToLocalStore({
            email: user.email as string,
            displayName: user.displayName as string,
            photoURL: user.photoURL as string,
            uid: user.uid
          })

        // window.location.reload();
        console.log('User logged in with Google:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });

      });
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  }


}

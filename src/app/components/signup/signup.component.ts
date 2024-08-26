import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "@angular/fire/auth";
import {doc, Firestore, setDoc} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,

  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm: FormGroup;
  auth: Auth = inject(Auth);


  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);
  toaster:ToastrService = inject(ToastrService);

  constructor(private fb: FormBuilder) {

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }


  redirectToSignupPage() {
    // Redirect to signup page
    this.router.navigate(['/sign-in']);
  }


  onSubmit() {
    if (this.signupForm.valid) {
      const {email, password} = this.signupForm.value;
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(userCredential => {

          this.router.navigate(['/sign-in']).then(() => {

            this.toaster.success('User signed up successfully');

          });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            this.toaster.error('Email already in use');
          } else {
            console.error('Error signing up:', error);
          }
        });
    }

  }

  async continueWithGoogle() {
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




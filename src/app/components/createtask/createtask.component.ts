import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {addDoc, collection, Firestore, Timestamp} from "@angular/fire/firestore";
import {getUserDataFromLocalStore} from "../../store";

@Component({
  selector: 'app-createtask',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './createtask.component.html',
  styleUrl: './createtask.component.css'
})
export class CreatetaskComponent {

  taskForm: FormGroup;
  user = getUserDataFromLocalStore();

  router: Router = inject(Router);
  firestore: Firestore = inject(Firestore);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', [Validators.required, this.noPastDateValidator()]],
      priority: ['low', [Validators.required]],
      status: ['to-do', [Validators.required]]
    });
  }

  noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value && control.value < today ? { 'pastDate': true } : null;
    };
  }

  async onSubmit() {
    if (this.user) {
      const task = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        dueDate: this.taskForm.value.dueDate,
        priority: this.taskForm.value.priority,
        status: this.taskForm.value.status,
        uid: this.user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        history: [{ date: new Date(), action: 'Task created' }]
      };

      try {
        const userTaskCollection = collection(this.firestore, `users/${this.user.uid}/tasks`);
        await addDoc(userTaskCollection, task);
        this.router.navigate(['/dashboard']).then(() => {
          // window.location.reload();
        });
      } catch (error) {
        console.error('Error adding task: ', error);
      }
    } else {
      console.error('No user is currently logged in.');
    }
  }
}

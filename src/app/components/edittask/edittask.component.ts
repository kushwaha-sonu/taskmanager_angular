import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { collection, doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { getUserDataFromLocalStore } from "../../store";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-edittask',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edittask.component.html',
  styleUrls: ['./edittask.component.css']
})
export class EdittaskComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  editForm: FormGroup;

  id: string = '';
  taskList: any = {};
  firestore: Firestore = inject(Firestore);
  toaster: ToastrService = inject(ToastrService);
  user = getUserDataFromLocalStore();

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') as string;
      this.getTask(this.firestore, this.user?.uid as string, this.id).then((task) => {
        if (task) {
          this.taskList = task;
          this.editForm.patchValue({
            title: this.taskList.title,
            description: this.taskList.description,
            dueDate: this.taskList.dueDate,
            priority: this.taskList.priority,
            status: this.taskList.status,
            createdAt: this.taskList.createdAt,
            updatedAt: this.taskList.updatedAt
          });
        }
      });
    });
  }

  async getTask(firestore: Firestore, userId: string, taskId: string) {
    const taskDocRef = doc(firestore, `users/${userId}/tasks/${taskId}`);
    const taskDoc = await getDoc(taskDocRef);

    if (taskDoc.exists()) {
      return {
        ...taskDoc.data(),
        id: taskDoc.id
      };
    } else {
      console.error('No such task!');
      return null;
    }
  }

  async onSubmit() {
    if (this.editForm.valid) {
      const taskData = this.editForm.value;
      const taskDocRef = doc(this.firestore, `users/${this.user?.uid}/tasks/${this.id}`);

      try {
        const taskDoc = await getDoc(taskDocRef);
        if (taskDoc.exists()) {
          const task = taskDoc.data();
          taskData['history'] = task['history'] || [];
          taskData['history'].push({ date: new Date(), action: 'Task edited' });
        }

        await setDoc(taskDocRef, taskData, { merge: true });
        this.toaster.success('Task updated successfully');
        await this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error updating task:', error);
        this.toaster.error('Error updating task');
      }
    } else {
      this.toaster.error('Please fill out the form correctly');
    }
  }
}

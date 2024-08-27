import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import {Router, RouterOutlet} from "@angular/router";
import { getUserDataFromLocalStore } from "../../store";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgClass,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Ensure this is correct
})
export class DashboardComponent {

  @ViewChild('prioritySelect') prioritySelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('statusSelect') statusSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('dueDateSelect') dueDateSelect!: ElementRef<HTMLSelectElement>;

  taskList: any[] = [];
  originalTaskList: any[] = []; // Add this to store the original task list

  firestore: Firestore = inject(Firestore);
  toaster: ToastrService = inject(ToastrService);
  router: Router = inject(Router);

  user: any;

  constructor() {
    this.user = getUserDataFromLocalStore();
    if (this.user?.uid) {
      this.getAllTasks(this.firestore, this.user.uid).then((taskList) => {
        this.taskList = taskList;
        this.originalTaskList = [...taskList]; // Store the original task list
        // console.log('Task list:', this.taskList);
      });
    }
  }

  async getAllTasks(firestore: Firestore, userId: string): Promise<any[]> {
    const userTaskCollection = collection(firestore, `users/${userId}/tasks`);
    const taskSnapshot = await getDocs(userTaskCollection);

    return taskSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data['createdAt'] ? data['createdAt'].toDate() : null, // Convert Firestore Timestamp to Date
      };
    });
  }

  async deleteTask(taskId: string, userId: string) {
    const taskDocRef = doc(this.firestore, `users/${userId}/tasks`, taskId);

    try {
      await deleteDoc(taskDocRef);
      this.toaster.success(`Task has been deleted successfully.`);
      this.taskList = await this.getAllTasks(this.firestore, this.user?.uid as string);
      // Optionally reset the original task list
      // this.originalTaskList = [...this.taskList];
      console.log(`Task with ID ${taskId} for user ${userId} has been deleted successfully.`);
    } catch (error) {
      console.error('Error deleting task:', error);
      this.toaster.error(`Error deleting task`);
    }
  }

  async editTask(taskId: string) {
    await this.router.navigate(['/edit-task', taskId]);
  }

  isDueToday(dueDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dueDate <= today;
  }

  exportAllTask() {
    const tasks = this.taskList.map(task => ({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toLocaleDateString()
    }));

    const csvContent = "data:text/csv;charset=utf-8,"
      + ["title,description,status,priority,dueDate"].join(",")
      + "\n"
      + tasks.map(task => Object.values(task).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  filterTasksByPriority(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPriority = selectElement.value.toLowerCase(); // Normalize the priority value

    if (selectedPriority) {
      this.taskList = this.originalTaskList.filter(task =>
        task.priority?.toLowerCase() === selectedPriority
      );
      this.taskList.forEach(task => task.history.push({ date: new Date(), action: `Filtered by priority: ${selectedPriority}` }));
    } else {
      // Reset to original task list if no valid priority selected
      this.taskList = [...this.originalTaskList];
    }
  }

  filterTasksByStatus(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStatus = selectElement.value.toLowerCase(); // Normalize the status value

    if (selectedStatus) {
      this.taskList = this.originalTaskList.filter(task =>
        task.status?.toLowerCase() === selectedStatus
      );
      this.taskList.forEach(task => task.history.push({ date: new Date(), action: `Filtered by status: ${selectedStatus}` }));
    } else {
      // Reset to original task list if no valid status selected
      this.taskList = [...this.originalTaskList];
    }
  }

  filterTasksByDueDate(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedDueDate = selectElement.value.toLowerCase();

    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (selectedDueDate === 'today') {
      this.taskList = this.originalTaskList.filter(task =>
        new Date(task.dueDate).toDateString() === new Date().toDateString()
      );
    } else if (selectedDueDate === 'this-week') {
      this.taskList = this.originalTaskList.filter(task =>
        new Date(task.dueDate) >= startOfWeek && new Date(task.dueDate) <= today
      );
    } else if (selectedDueDate === 'this-month') {
      this.taskList = this.originalTaskList.filter(task =>
        new Date(task.dueDate) >= startOfMonth && new Date(task.dueDate) <= today
      );
    } else {
      this.taskList = [...this.originalTaskList];
    }
    this.taskList.forEach(task => task.history.push({ date: new Date(), action: `Filtered by due date: ${selectedDueDate}` }));
  }

  removeFilter() {
    this.taskList = [...this.originalTaskList];
    this.prioritySelect.nativeElement.value = 'select';
    this.statusSelect.nativeElement.value = 'select';
    this.dueDateSelect.nativeElement.value = 'select';
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  allTaskClick(){
    this.router.navigate(['/dashboard']).then(()=>{
      this.taskList = this.originalTaskList;
    });
  }

  allTaskHistoryClick(){
    this.router.navigate(['/dashboard/history']).then(()=>{
      this.taskList = this.originalTaskList;
    });
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}

import {Component, inject} from '@angular/core';
import {collection, Firestore, getDocs} from "@angular/fire/firestore";
import {getUserDataFromLocalStore} from "../../store";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    MatDivider
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {


  taskList: any[] = [];
  originalTaskList: any[] = []; // Add this to store the original task list

  firestore: Firestore = inject(Firestore);

  user;

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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isDueToday(dueDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dueDate <= today;
  }


  convertTimestampToDate(seconds: number, nanoseconds: number): string {
    const milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}  `;
  }
}

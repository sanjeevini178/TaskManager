import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  taskName: string = '';
  taskDesc: string = '';
  taskDate: Date = new Date();

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.sortTasksByDueDate();
    });
  }

  toggleStatus(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      const updatedTask: Task = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' };
      this.taskService.updateTask(id, updatedTask).subscribe(() => this.loadTasks());
    }
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }

  isDateInFuture(date: Date): boolean {
    return new Date(date).getTime() > new Date().getTime();
  }

  addTask(): void {
    const newTask: Task = {
      id: this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1,
      name: this.taskName.trim(),
      description: this.taskDesc.trim(),
      dueDate: this.taskDate,
      status: 'pending'
    };
    this.taskService.addTask(newTask).subscribe(() => {
      this.loadTasks();
      // Reset form fields after submission
      this.taskName = '';
      this.taskDesc = '';
      this.taskDate = new Date();
    });
  }

  viewTaskDetail(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  sortTasksByDueDate(): void {
    this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
}

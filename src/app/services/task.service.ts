import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private tasksSubject = new BehaviorSubject<Task[]>([]);
    tasks$ = this.tasksSubject.asObservable();

    constructor() {
        this.loadTasks();
    }

    private get tasks(): Task[] {
        return this.tasksSubject.value;
    }

    addTask(title: string) {

        const newTask: Task = {
            id: Date.now(),
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };

        const updatedTasks = this.sortTasks([...this.tasks, newTask]);
        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);
    }

    private sortTasks(tasks: Task[]): Task[] {
        return tasks.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    toggleTask(id: number) {

        const updatedTasks = this.tasks.map(task => 
            task.id === id ? {...task, completed: !task.completed } : task);

        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);
    }

    removeTask(id: number) {

        const updatedTasks = this.tasks.filter(task => task.id !== id);

        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);
    }

    clearCompleted() {

        const updatedTasks = this.tasks.filter(task => !task.completed);

        this.tasksSubject.next(updatedTasks);
        this.saveTasks(updatedTasks);

    }

    private saveTasks(tasks: Task[]) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    private loadTasks() {

        const data = localStorage.getItem('tasks');

        if (data) {
            const tasks = JSON.parse(data);
            this.tasksSubject.next(this.sortTasks(tasks));
        }
    }

}

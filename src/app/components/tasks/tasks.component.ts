import { Component} from '@angular/core';
import { TaskService } from '../../services/task.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css'
})
export class TasksComponent {

    newTask: string = '';

    tasks$;
    completedCount$;
    totalCount$;
    filteredTasks$;
    
    
    filter$ = new BehaviorSubject<'all' | 'completed' | 'pending'>('all');

    constructor(private taskService: TaskService) {

        this.tasks$ = this.taskService.tasks$;

        this.completedCount$ = this.tasks$.pipe(map(tasks => tasks.filter(task => task.completed).length));

        this.totalCount$ = this.tasks$.pipe(map(tasks => tasks.length));

        this.filteredTasks$ = combineLatest([
            this.tasks$,
            this.filter$
            ]).pipe(
            map(([tasks, filter]) => {

                if (filter === 'completed') {
                    return tasks.filter(task => task.completed);
                }

                if (filter === 'pending') {
                    return tasks.filter(task => !task.completed);
                }

                return tasks;
            })
        );
    }    

    addTask() {
        if (this.newTask.trim()) {
            this.taskService.addTask(this.newTask);
            this.newTask = '';
        }
    }

    toggleTask(id: number) {
        this.taskService.toggleTask(id);
    }

    clearCompleted() {
        this.taskService.clearCompleted();
    }

    removeTask(id: number) {
        this.taskService.removeTask(id);
    }
}



import {Injectable} from '@angular/core';
import {Task} from './todo-details/todo-details.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private todoFixture: Task[] = [
    {
      id: 1,
      title: 'implement a dashboard',
    },
    {
      id: 2,
      title: 'implement a todo details',
    },
    {
      id: 3,
      title: 'take a break',
      description: 'cheer the life'
    },
  ];


  constructor() {
  }


  getTodos(): Task[] {
    return this.todoFixture;
  }


  getTodoAsReference(id: number): Task {
    return this.todoFixture.find(
      todo => todo.id === id
    )!;
  }


  getTodoAsClone(id: number): Task {
    return Object.assign(
      {},
      this.todoFixture.find(
        todo => todo.id === id
      )!
    );
  }

}

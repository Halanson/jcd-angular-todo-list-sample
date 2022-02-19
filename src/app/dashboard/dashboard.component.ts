import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {Task} from '../todo-details/todo-details.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public tasks: Task[] = [];
  public inlineTask: Task | undefined;

  constructor(
    private $apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.tasks = this.$apiService.getTodos();
  }

  public showInlineDetails(task: Task): void {
    this.inlineTask = task;
  }
}

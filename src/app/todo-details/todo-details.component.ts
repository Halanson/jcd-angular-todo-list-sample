import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../api.service';

export interface Task {
  id: number,
  title: string,
  description?: string,
}

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss']
})
export class TodoDetailsComponent implements OnInit {

  @Input() todo: Task | undefined;

  @Output() todoChange = new EventEmitter<Task>();

  todoForm = this.$formBuilder.group({
    title: [
      '',
      [
        Validators.required,
      ],
    ],
    description: [
      '',
    ],
  });


  constructor(
    private $activatedRoute: ActivatedRoute,
    private $apiService: ApiService,
    private $formBuilder: FormBuilder,
  ) {
  }


  get title(): AbstractControl | null {
    return this.todoForm.get('title');
  }


  get description(): AbstractControl | null {
    return this.todoForm.get('description');
  }


  ngOnInit(): void {
    if (!this.todo) {
      this.$activatedRoute.paramMap.subscribe(
        (params) => {
          // objects from an api are always clones of the DB record.
          // it is important to know if the object we use is a reference
          // or a clone. if the object is a reference we can easily change
          // the value of the source by changing the reference in the whole
          // application.
          // for clones the behavior is way different.

          // @todo change getTodoAsReference to getTodoAsClone and test the
          //       behavior of the app again
          this.todo = this.$apiService.getTodoAsReference(
            parseInt(
              params.get('id')!
            )
          );

          this.title?.setValue(this.todo.title);
          this.description?.setValue(this.todo.description);
        }
      );
    } else {
      this.title?.setValue(this.todo.title);
      this.description?.setValue(this.todo.description);
    }
  }


  public submitForm(): void {
    this.todo!.title = this.title!.value;
    this.todo!.description = this.description!.value;

    this.todoChange.emit(this.todo);
  }
}

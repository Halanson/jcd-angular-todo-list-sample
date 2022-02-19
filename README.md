# todos

1. node + npm installieren
2. angular-cli global installieren
   `$ npm install -g @angular/cli`
3. "Angular DevTools" für
   Browser [Chrome](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh) (
   empfohlen), [Firefox](https://addons.mozilla.org/de/firefox/addon/angular_state_inspector/)
4. PHPStorm Testversion installieren (optional)

# installieren

1. angular-cli global installieren
   `$ npm install -g @angular/cli`

2. angular app erstellen
   `$ ng new todo-list-app --strict`
   - routing: yes
   - stylesheet: scss

3. ggf npm installation neu starten
   `$ npm i --force`

4. PHPStorm -> File -> Open

5. in PHPStorm terminal app starten
   `$ npm run start`

1. alles angucken
   - /app/src/*

# componenten erstellen

1. todo-details componente erstellen
   - PHPStorm /app/src/* RMB -> new -> angular schematic -> component -> "todo-details"
   - alternativ cli: ng generate component todo-details

2. dashboard componente erstellen
   - PHPStorm /app/src/* RMB -> new -> angular schematic -> component -> "dashboard"
   - alternativ cli: ng generate component dashboard

# routing

1. routen definieren reihenfolge ist wichtig! (catch all am schluss)

```typescript
// src/app/app-routing.module.ts

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'detail/:id', component: TodoDetailsComponent},
];
```

2. aktualisierte webseite ansehen
3. platzhalter aus der app.html rauswerfen
4. invalide URL aufrufen...
5. wildecard URL im routing ergänzen

```typescript
// src/app/app-routing.module.ts

const routes: Routes = [
  // rest
  {path: '**', component: DashboardComponent},
];
```

# interfaces

1. task interface ergänzen

```typescript
// src/app/todo-details/todo-details.component.ts

export interface Task {
  id: number,
  title: string,
  description?: string, // property?: string === property: undefined | string
}

@Component({[..]
// rest
```

# services

1. api-service erstellen
   - PHPStorm /app/* RMB -> new -> angular schematic -> service -> "api"
   - alternativ cli: ng generate service api

2. quelltext

```typescript
// src/app/api.service.ts

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
  ]


  constructor() {
  }


  getTodos(): Task[] {
    return this.todoFixture;
  }


  // @todo force return Task or add undefined as return type
  // @todo fix parameter type, should be a number
  getTodoAsReference(id: string): Task {
    return this.todoFixture.find(
      todo => todo.id === id
    ) // !
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
```

# create the dashboard

```typescript
// src/app/dashboard/dashboard.component.ts

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
}

```

```angular2html
// src/app/dashboard/dashboard.component.html

<h1>Dashboard</h1>

<div class="todo-head">
  <div class="nr">Nr.</div>
  <div class="title">Title</div>
  <div class="description">Description</div>
  <div class="actions">Actions</div>
</div>

<div class="todo-list">
  <div *ngFor="let task of tasks"
       class="todo-item"
  >
    <div class="nr">#{{ task.id }}</div>
    <div class="title">{{ task.title }}</div>
    <div class="description">{{ task.description }}</div>
    <div class="actions">
      <!-- @todo actions -->
    </div>
  </div>
</div>

<!-- @todo inline details -->
```

```scss
// src/app/dashboard/dashboard.component.scss

.todo-head {
  display: flex;
  font-weight: bold;
}

.todo-item {
  display: flex;
}

.nr {
  flex: 1 1 100%;
  max-width: 10%;
}

.title {
  flex: 1 1 100%;
  max-width: 20%;
}

.description {
  flex: 1 1 0;
  max-width: 100%;
}

.actions {
  display: flex;
  flex: 1 1 100%;
  max-width: 10%;
}
```

2. aktionen `router link` und `inline details` hinzufügen
  - `@todo actions` innerhalb von ersetzen mit:

```angular2html
// src/app/dashboard/dashboard.component.html

<div class="actions">
  <!-- @todo actions -->
  <a [routerLink]="['/detail', task.id]"> route </a> &nbsp;
  <div (click)="showInlineDetails(task)">
    inline
  </div>
</div>
```

- fehlende methode in der komponente ergänzen

```typescript
// src/app/dashboard/dashboard.component.ts

public showInlineDetails(task: Task): void {
  this.inlineTask = task;
}
```

- `@todo inline details` ersetzen

```angular2html
// src/app/dashboard/dashboard.component.html

<!-- @todo inline details -->
<div *ngIf="inlineTask">
  <hr>
  <div>Inline Details</div>

  <div class="nr">#{{ inlineTask.id }}</div>
  <div class="title">{{ inlineTask.title }}</div>
  <div class="description">{{ inlineTask.description }}</div>

</div>

```

# details komponente

```typescript
// src/app/todo-details/todo-details.component.ts

import {Component, OnInit} from '@angular/core';
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

  todo: Task | undefined;

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
  }

  public submitForm(): void {
    this.todo!.title = this.title!.value;
    this.todo!.description = this.description!.value;
  }
}
```

```angular2html
// src/app/todo-details/todo-details.component.html

<h1>Details of #{{ todo?.id }} - {{ todo?.title }}</h1>

<a routerLink="/dashboard">zurück</a>


<hr>


<h3>reactive forms (empfohlen)</h3>
<form (submit)="submitForm()"
      [formGroup]="todoForm"
>
  <input formControlName="title"
         placeholder="title"
         required
         type="text"
  />
  <br>
  <textarea formControlName="description"
            placeholder="description"
  >
  </textarea>
  <br>
  <button type="submit">
    save
  </button>

</form>


<hr>


<h3>model form</h3>
<form>
  <input [(ngModel)]="todo!.title"
         name="title"
         placeholder="title"
         required
         type="text"
  >
  <br>
  <textarea [(ngModel)]="todo!.description"
            name="description"
            placeholder="description"
  >
  </textarea>
  <br>
  <button (click)="scope.saved = !scope.saved"
          *ngIf="{saved: false} as scope"
          type="button"
  >
    {{ scope.saved
       ? 'saved!'
       : '(pseudo) save' }}
  </button>
</form>

<hr>

<h3>live model-value</h3>
<pre>{{ todo | json}}</pre>
```

# @input und @output event handler

```typescript
// src/app/todo-details/todo-details.component.ts

// change property
@Input() todo: Task | undefined;

// add property
@Output() todoChange = new EventEmitter<Task>();


ngOnInit(): void {
  // add if
  if(!this.todo) {
    this.$activatedRoute.paramMap.subscribe(
      (params) => {
        this.todo = this.$apiService.getTodoAsReference(
          parseInt(
            params.get('id')!
          )
        );
  
        this.title?.setValue(this.todo.title);
        this.description?.setValue(this.todo.description);
      }
    );
  // add else
  } else {
    this.title?.setValue(this.todo.title);
    this.description?.setValue(this.todo.description);
  }
}


public submitForm(): void {
  this.todo!.title = this.title!.value;
  this.todo!.description = this.description!.value;

  // add change event
  this.todoChange.emit(this.todo);
}
```

```angular2html
// src/app/dashboard/dashboard.component.html

// replace inline details with
<app-todo-details *ngIf="inlineTask"
                  [(todo)]="inlineTask"
>

</app-todo-details>

```

# phpStorm

1. package.json / composer.json
   1. play button
   2. version autovervollständigung
2. tests
   1. play button
   2. auswertung
3. rename Task -> Todo
4. scaffolding
5. 

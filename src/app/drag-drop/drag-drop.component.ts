  import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
  import { Component,Inject } from '@angular/core';
  import {MatDialog} from '@angular/material/dialog';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';

  @Component({
    selector: 'app-drag-drop',
    templateUrl: './drag-drop.component.html',
    styleUrls: ['./drag-drop.component.css']
  })

  export class DragDropComponent {
    newItem: string = '';
    todo: string[] = [];
    done: string[] = [];
    currentDateTime: string = '';
    constructor(private dialog: MatDialog,private _snackBar: MatSnackBar){}
    ngOnInit() {
      this.loadDataFromLocalStorage();
      this.updateCurrentDateTime();
      interval(1000).subscribe(() => {
        this.updateCurrentDateTime();
      });
    }
    updateCurrentDateTime() {
      const currentDateTime = new Date();
      this.currentDateTime = currentDateTime.toLocaleString(); 
    }
    getCurrentDateTime(): string {
      const currentDateTime = new Date();
      return currentDateTime.toLocaleString(); 
    }
    loadDataFromLocalStorage() {
      const savedTodo = localStorage.getItem('todo');
      if (savedTodo) {
        this.todo = JSON.parse(savedTodo);
      }
  
      const savedDone = localStorage.getItem('done');
      if (savedDone) {
        this.done = JSON.parse(savedDone);
      }
    }
    
    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(AddItemDialogComponent, {
        width: '289px',
        data: this.newItem,
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.todo.push(result);
          this.saveDataLocally(); 
          this.OpenSnackBar(`Добавлен элемент "${result}" в коллекцию ToDO`,'Закрыть' )
        }
      });
    }

    deleteItemsToDo(item: string) {
      const index = this.todo.indexOf(item);
      if (index !== -1) {
        this.todo.splice(index, 1);
        this.saveDataLocally(); 
      }
      this.OpenSnackBar(`Удален элемент "${item}" из коллекции ToDO`,'Закрыть' )
    }
    
    deleteItemsDone(item: string) {
      const index = this.done.indexOf(item);
      if (index !== -1) {
        this.done.splice(index, 1);
        this.saveDataLocally(); 
      }
      this.OpenSnackBar(`Удален элемент "${item}" из коллекции Done`,'Закрыть' )
    }
    private saveDataLocally() {
      localStorage.setItem('todo', JSON.stringify(this.todo));
      localStorage.setItem('done', JSON.stringify(this.done));
    }
    OpenSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 3000,
        horizontalPosition: "center"
      });
    }
  }
  
 

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  priority: string = '';
  todo: { text: string, createdTime: string, prior: string }[] = [];
  done: { text: string, createdTime: string, prior: string }[] = [];
  currentDateTime: string = '';
  isSortedByPriority: boolean = false;
   priorityMapping: { [key: number]: string } = {
    0: 'Нет',
    1: 'Низкий',
    2: 'Средний',
    3: 'Высокий',
  };
  priorityText(prior: string): string {
    const priorityNumber = parseInt(prior, 10);
  
    switch (priorityNumber) {
      case 0:
        return 'Нет';
      case 1:
        return 'Низкий';
      case 2:
        return 'Средний';
      case 3:
        return 'Высокий';
      default:
        return prior; 
    }
  }
  priorityColor(prior: string): string {
    const priorityNumber = parseInt(prior, 10);
  
    switch (priorityNumber) {
      case 0:
        return 'gray'; 
      case 1:
        return 'green'; 
      case 2:
        return 'orange'; 
      case 3:
        return 'red'; 
      default:
        return 'black';
    }
  }
  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.updateCurrentDateTime();
    this.loadDataFromLocalStorage();
    interval(1000).subscribe(() => {
      this.updateCurrentDateTime();
    });
  }
  sortItemsByPriority(items: { text: string, createdTime: string, prior: string }[]): { text: string, createdTime: string, prior: string }[] {
    return items.sort((b, a) => Number(a.prior) - Number(b.prior));
  }
  toggleSorting() {
    this.isSortedByPriority = !this.isSortedByPriority;

  if (this.isSortedByPriority) {
    this.todo = this.sortItemsByPriority(this.todo);
  }
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '300px',
      data: {
        newItem: this.newItem,
        priority: this.priority
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newItem = result.newItem;
        this.priority = result.priority;
  
        const priorityText = this.priorityMapping[Number(this.priority)];
  
        const currentTime = this.getCurrentDateTime();
        this.todo.push({ text: this.newItem, createdTime: currentTime, prior:this.priority });
        this.saveDataLocally();
        this.OpenSnackBar(`Добавлен элемент "${this.newItem}" в коллекцию ToDO. Приоритет: ${priorityText}`, 'Закрыть');
      }
    });
  }
  

  deleteItemsToDo(item: { text: string, createdTime: string, prior: string }) {
    const index = this.todo.indexOf(item);
    if (index !== -1) {
      this.todo.splice(index, 1);
      this.saveDataLocally();
    }
    this.OpenSnackBar(`Удален элемент "${item.text}" из коллекции ToDO`, 'Закрыть');
  }

  deleteItemsDone(item: { text: string, createdTime: string, prior: string }) {
    const index = this.done.indexOf(item);
    if (index !== -1) {
      this.done.splice(index, 1);
      this.saveDataLocally();
    }
    this.OpenSnackBar(`Удален элемент "${item.text}" из коллекции Done`, 'Закрыть');
  }

  private saveDataLocally() {
    localStorage.setItem('todo', JSON.stringify(this.todo));
    localStorage.setItem('done', JSON.stringify(this.done));
  }

  OpenSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
    });
  }

  drop(event: CdkDragDrop<{ text: string, createdTime: string, prior: string }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      this.saveDataLocally();
    }
  }
}

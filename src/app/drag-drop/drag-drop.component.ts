import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { EditItemDialogComponent } from '../edit-item-dialog/edit-item-dialog.component';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent {
  newItem: string = '';
  priority: string = '';
  todo: { text: string, description: string, createdTime: string, prior: string, doneat: string }[] = [];
  done: { text: string, description: string, createdTime: string, prior: string, doneat: string }[] = [];
  
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
  sortItemsByPriority(items: { text: string,description: string, createdTime: string, prior: string, doneat: string }[]): { text: string,description: string, createdTime: string, prior: string, doneat: string }[] {
    return items.sort((b, a) => Number(a.prior) - Number(b.prior));
  }
  toggleSorting() {
    this.isSortedByPriority = !this.isSortedByPriority;

  if (this.isSortedByPriority) {
    this.todo = this.sortItemsByPriority(this.todo);
  }
  this.isSortedByPriority = false
  }
  updateCurrentDateTime() {
    const currentDateTime = new Date();
    this.currentDateTime = currentDateTime.toLocaleString();
  }

  getCurrentDateTime(): string {
    const currentDateTime = new Date();
    return currentDateTime.toLocaleString();
  }

  getDoneDateTime():string {
    const donedate = new Date();
    return donedate.toLocaleString();
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
        const description = result.description;
  
        const priorityText = this.priorityMapping[Number(this.priority)];
  
        const currentTime = this.getCurrentDateTime();
        this.todo.push({ text: this.newItem, description, createdTime: currentTime, prior: this.priority, doneat: '0' });
        this.saveDataLocally();
        this.OpenSnackBar(`Добавлен элемент "${this.newItem}" в коллекцию ToDO. Приоритет: ${priorityText}`, 'Закрыть');
      }
    });
  }
  openEditDialog(item: { text: string, description: string, createdTime: string, prior: string }): void {
    const dialogRef = this.dialog.open(EditItemDialogComponent, {
      width: '300px',
      data: {
        text: item.text,
        description: item.description, 
        priority: item.prior
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.text = result.text;
        item.description = result.description;
        item.prior = result.priority;
  
        const priorityText = this.priorityMapping[Number(item.prior)];
  
        this.saveDataLocally();
        this.OpenSnackBar(`Изменения в элементе "${item.text}" сохранены. Приоритет: ${priorityText}`, 'Закрыть');
      }
    });
  }
  
  

  deleteItemsToDo(item: { text: string, description: string, createdTime: string, prior: string, doneat: string }) {
    const index = this.todo.indexOf(item);
    if (index !== -1) {
      this.todo.splice(index, 1);
      this.saveDataLocally();
    }
    this.OpenSnackBar(`Удален элемент "${item.text}" из коллекции ToDO`, 'Закрыть');
  }

  deleteItemsDone(item: { text: string,description: string, createdTime: string, prior: string, doneat: string }) {
    const index = this.done.indexOf(item);
    if (index !== -1) {
      this.done.splice(index, 1);
      this.saveDataLocally();
    }
    this.OpenSnackBar(`Удален элемент "${item.text}" из коллекции Done`, 'Закрыть');
  }
  
    deleteAll() {
      localStorage.removeItem('todo');
      localStorage.removeItem('done');
      this.todo = []; 
      this.done = []; 
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

  drop(event: CdkDragDrop<{ text: string, description: string, createdTime: string, prior: string, doneat: string }[]>, listName: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      if (listName === 'done') {
        const item = this.done[event.currentIndex];
        item.doneat = this.getDoneDateTime();
      }
  
      this.saveDataLocally();
    }
  }
  
}

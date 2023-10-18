import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';

const routes: Routes = [ 
  { path: '', redirectTo: '/ToDo', pathMatch: 'full' },
  { path: 'ToDo', component: DragDropComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

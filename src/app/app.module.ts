import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BoardComponent } from './components/board/board.component';
import { AddNewTaskComponent } from './components/add-new-task/add-new-task.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './state/app.reducer';
import { AddNewBoardComponent } from './components/add-new-board/add-new-board.component';
import { AddNewColumnComponent } from './components/add-new-column/add-new-column.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ViewTaskComponent } from './components/view-task/view-task.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { SliderComponent } from './components/slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    BoardComponent,
    AddNewTaskComponent,
    AddNewBoardComponent,
    AddNewColumnComponent,
    ViewTaskComponent,
    EditBoardComponent,
    EditTaskComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ app: appReducer }),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

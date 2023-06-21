import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { Firestore, connectFirestoreEmulator, getFirestore, initializeFirestore, provideFirestore } from '@angular/fire/firestore';

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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { LogoComponent } from './components/logo/logo.component';
import { AuthModule, provideAuth, connectAuthEmulator, getAuth } from '@angular/fire/auth';
import { AuthService } from './components/service/auth.service';

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
    SliderComponent,
    LoginComponent,
    DashboardComponent,
    LogoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    StoreModule.forRoot({ app: appReducer }),
    StoreDevtoolsModule.instrument(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      let firestore: Firestore;
      if (environment.useEmulators) {
        // long polling required for Cypress
        firestore = initializeFirestore(getApp(), {
          experimentalForceLongPolling: true,
        });
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      } else {
        firestore = getFirestore();
      }
      return firestore;
    }),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

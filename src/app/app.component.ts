import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState, DatabaseAppState, MobileCss, User } from "./state/app.state";
import { addAppState, toggleMobile, toggleSidebar } from "./state/app.actions";
import { MOBILE_MAX_WIDTH } from "./constants/constants";
import { firstValueFrom, take } from "rxjs";
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, setDoc, DocumentData } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'kanban';
  public sidebarVisible = false;
  public addNewTaskModalVisible: boolean | undefined = false;
  public createNewBoard = false;
  public addNewColumnModalVisible = false;
  public editColumnModalVisible = false;
  public viewTaskModalVisible = false;
  public editBoardModalVisible = false;
  public editTaskModalVisible = false;
  public theme = 'light';
  public isMobile = false;

  firestore: Firestore = inject(Firestore);

  @ViewChild('mobileBackground')
  public mobileBackground: ElementRef | undefined;

  mobileCss: MobileCss | undefined;

  constructor(private store: Store<{ app: AppState }>) {
    this.fetchFromDatabase();
    // detect tab switch out
    window.addEventListener('blur', this.updateDatabase.bind(this, 'blur'));

    // detect tab close
    window.addEventListener('beforeunload', this.updateDatabase.bind(this, 'beforeunload'));
  }

  fetchFromDatabase() {
    const userCollection = collection(this.firestore, 'users');
    const userId = 'G3bmhp8l7yRVwWkLVIHo';
    const userRef = doc(userCollection, '/', userId);
    const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
    try {
      collectionData(userCollection).pipe(take(1)).subscribe(data => {
        if (data.length > 0) {
          const user = data[0] as User;
          this.store.dispatch(addAppState({ appState: user.appState, isMobile }));
        }
      });

    } catch (error) {
      console.error(error);
    }
  }

  updateDatabase(event: string) {
    const userCollection = collection(this.firestore, 'users');
    const userId = '44BMgfptP93YNpacVgkN';
    const userRef = doc(userCollection, '/', userId);
    const email = 'parthmanhas@gmail.com';
    this.store.select(state => state)
      .pipe(take(1))
      .subscribe((currentState) => {
        console.info(`Adding to Firestore: ${event}`);
        const dbAppState = this.convertToDatabaseAppState(currentState.app);
        if (!dbAppState.boards) {
          console.error('No boards found in app state');
          return;
        }
        const updatedUserData = { id: userId, appState: dbAppState, email };
        setDoc(userRef, updatedUserData, { merge: true })
          .then(() => {
            console.log('User document updated successfully');
          })
          .catch((error) => {
            console.error('Error updating user document: ', error);
          });
        // Here, you have access to the initial state of the app
        // Perform your Firebase data storage operation here
        // Use currentState to access the relevant data from the state
        // and save it to Firebase
      });
  }

  convertToDatabaseAppState(appState: AppState): DatabaseAppState {
    const { boards, theme } = appState;
    return { boards, theme } satisfies DatabaseAppState;
  }

  ngAfterViewInit() {
    this.store.select(state => state).subscribe(state => {
      this.createNewBoard = state.app.createBoardModalVisible;
      this.addNewTaskModalVisible = state.app.addNewTaskModalVisible;
      this.addNewColumnModalVisible = state.app.addNewColumnModalVisible;
      this.editColumnModalVisible = state.app.editColumnModalVisible;
      this.viewTaskModalVisible = state.app.viewTaskModalVisible;
      this.editBoardModalVisible = state.app.editBoardModalVisible;
      this.editTaskModalVisible = state.app.editTaskModalVisible;
      this.theme = state.app.theme
      this.isMobile = state.app.isMobile || false;
      this.sidebarVisible = state.app.sidebarVisible;
      this.mobileCss = state.app.mobileCss;

      if (this.mobileBackground && this.isMobile) {
        this.mobileBackground.nativeElement.style.display = this.sidebarVisible ? 'block' : 'none';
        this.mobileBackground.nativeElement.style.top = `${this.mobileCss?.top}px`;
      }
    });
  }

  hideSidebarVisibleEvent() {
    this.sidebarVisible = !this.sidebarVisible;
    this.store.dispatch(toggleSidebar({ sidebarVisible: this.sidebarVisible }));
  }
}

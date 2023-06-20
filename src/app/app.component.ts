import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState, DatabaseAppState } from "./state/app.state";
import { take } from "rxjs";
import { inject } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban';

  firestore: Firestore = inject(Firestore);

  constructor(private store: Store<{ app: AppState }>) {


    // detect tab switch out
    window.addEventListener('blur', this.updateDatabase.bind(this, 'blur'));

    // detect tab close
    window.addEventListener('beforeunload', this.updateDatabase.bind(this, 'beforeunload'));
  }

  updateDatabase(event: string) {
    const userCollection = collection(this.firestore, 'users');
    this.store.select(state => state)
      .pipe(take(1))
      .subscribe((currentState) => {
        if (!currentState.app.user) {
          console.error(`No user found in app state: ${event}`);
          return;
        }
        console.info(`Adding to Firestore: ${event}`);
        const userId = currentState.app.user.id;
        const email = currentState.app.user.email;
        const userRef = doc(userCollection, '/', userId);
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


}

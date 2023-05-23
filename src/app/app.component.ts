import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "./state/app.state";
import { toggleSidebar } from "./state/app.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban';
  public sidebarVisible = false;
  public createNewTask = false;
  public createNewBoard = false;
  public addNewColumnModalVisible = false;
  public editColumnModalVisible = false;
  public viewTaskModalVisible = false;
  public editBoardModalVisible = false;
  public editTaskModalVisible = false;

  constructor(private store: Store<{ app: AppState }>) {
    this.store.select(state => state).subscribe(state => {
      this.createNewBoard = state.app.createBoardModalVisible;
      this.addNewColumnModalVisible = state.app.addNewColumnModalVisible;
      this.editColumnModalVisible = state.app.editColumnModalVisible;
      this.viewTaskModalVisible = state.app.viewTaskModalVisible;
      this.editBoardModalVisible = state.app.editBoardModalVisible;
      this.editTaskModalVisible = state.app.editTaskModalVisible;
    });
  }

  hideSidebarVisibleEvent() {
    this.sidebarVisible = !this.sidebarVisible;
    this.store.dispatch(toggleSidebar({ sidebarVisible: this.sidebarVisible }));
  }
}

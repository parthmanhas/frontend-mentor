import { Component } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban';
  public sidebarVisible = false;
  public createNewTask = false;

  hideSidebarEvent() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  createNewTaskEvent() {
    this.createNewTask = true;
  }

  closeModalEvent() {
    this.createNewTask = false;
  }
}

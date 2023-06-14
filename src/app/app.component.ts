import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState, MobileCss } from "./state/app.state";
import { toggleMobile, toggleSidebar } from "./state/app.actions";
import { MOBILE_MAX_WIDTH } from "./constants/constants";

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

  @ViewChild('mobileBackground')
  public mobileBackground: ElementRef | undefined;

  mobileCss: MobileCss | undefined;

  constructor(private store: Store<{ app: AppState }>) {
    const windowWidth = window.innerWidth;
    if (windowWidth <= MOBILE_MAX_WIDTH) {
      this.store.dispatch(toggleMobile({ isMobile: true }));
    }

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

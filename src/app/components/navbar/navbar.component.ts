import { Component, Output, EventEmitter, ElementRef, AfterViewInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { deleteBoard, editBoard, setMobileCss, toggleAddNewTask, toggleSidebar } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

    public addNewTaskButtonDisabled = true;
    public isMobile = false;
    public showBoardOptionsModal = false;
    public edit = false;
    public deleteBoardModalVisible = false;
    public currentBoard: Board | null = null;
    public sidebarVisible = false;

    constructor(private store: Store<{ app: AppState }>, private elementRef: ElementRef) {
        this.store.select(state => state).subscribe(state => {
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
            this.addNewTaskButtonDisabled = !((this.currentBoard?.columns?.length ?? 0) > 0);
            this.sidebarVisible = state.app.sidebarVisible;
            this.isMobile = state.app.isMobile || false;
        });
    }
    
    ngAfterViewInit() {
        this.store.dispatch(setMobileCss({ mobileCss: { top: this.elementRef.nativeElement.offsetHeight } }));
    }

    addNewTask() {
        if (this.isMobile && this.addNewTaskButtonDisabled) return;

        this.store.dispatch(toggleAddNewTask({ addNewTaskModalVisible: true }));
    }

    deleteBoard() {
        this.deleteBoardModalVisible = false;
        this.store.dispatch(deleteBoard({ board: this.currentBoard! }));
    }

    showEditBoardModal() {
        this.store.dispatch(editBoard({ editBoardModalVisible: true }));
    }

    toggleMobileSideBar(value: boolean) {
        this.store.dispatch(toggleSidebar({ sidebarVisible: value }));
    }
}
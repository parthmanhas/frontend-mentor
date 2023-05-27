import { Component, Output, EventEmitter } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { deleteBoard, editBoard, toggleAddNewTask } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    public addNewTaskButtonDisabled = true;

    public showBoardOptionsModal = false;
    public edit = false;
    public deleteBoardModalVisible = false;
    public currentBoard: Board | null = null;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
            this.addNewTaskButtonDisabled = !((this.currentBoard?.columns?.length ?? 0) > 0);
        });
    }
    
    addNewTask() {
        this.store.dispatch(toggleAddNewTask({ addNewTaskModalVisible: true }));
    }

    deleteBoard() {
        this.deleteBoardModalVisible = false;
        this.store.dispatch(deleteBoard({ board: this.currentBoard! }));
    }

    showEditBoardModal() {
        this.store.dispatch(editBoard({ editBoardModalVisible: true }));
    }
}
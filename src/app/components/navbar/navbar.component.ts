import { Component, Output, EventEmitter } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { deleteBoard, editBoard } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    @Output()
    public createNewTask = new EventEmitter<boolean>();

    public addNewTaskButtonDisabled = true;

    public showBoardOptionsModal = false;
    public edit = false;
    public deleteBoardModalVisible = false;
    public currentBoard: Board | null = null;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.addNewTaskButtonDisabled = !((this.currentBoard?.columns?.length ?? 0) > 0);
        });
    }

    public buttonClick(buttonName: string): void {
        if (buttonName === 'addNewTask' && !this.addNewTaskButtonDisabled) {
            this.createNewTask.emit(true);
        }
    }

    deleteBoard() {
        this.deleteBoardModalVisible = false;
        this.store.dispatch(deleteBoard({ board: this.currentBoard! }));
    }

    showEditBoardModal() {
        this.store.dispatch(editBoard({ editBoardModalVisible: true }));
    }
}
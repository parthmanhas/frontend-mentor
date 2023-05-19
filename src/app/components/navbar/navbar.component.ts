import { Component, Output, EventEmitter } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    @Output()
    public createNewTask = new EventEmitter<boolean>();

    public addNewTaskButtonDisabled = true;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            const currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.addNewTaskButtonDisabled = !((currentBoard?.columns?.length ?? 0) > 0);
        });
    }

    public buttonClick(buttonName: string): void {
        if (buttonName === 'addNewTask') {
            this.createNewTask.emit(true);
        }
    }
}
import { Component, HostBinding, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { addColumn, addNewColumnModalVisible, createBoardModalVisible, deleteColumn, editColumn } from "src/app/state/app.actions";
import { AppState, Board, Column } from "src/app/state/app.state";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {

    public sidebarVisible = false;

    @HostBinding('style')
    get translateBoard() {
        if (this.sidebarVisible) {
            return {
                transform: 'translateX(0)'
            }
        }
        else {
            return {
                transform: 'translateX(15vw)'
            }
        }
    }

    public currentBoard: Board | null = null;
    public minOneBoardAvailable: boolean = false;
    public minOneColumnAvailable: boolean = false;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.sidebarVisible = state.app.sidebarVisible;
            this.minOneBoardAvailable = state.app.boards.length > 0;
            this.minOneColumnAvailable = (this.currentBoard?.columns?.length ?? -1) > 0;
        });

    }

    openCreateBoardModal() {
        this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: true }));
    }

    openAddNewColumnModal() {
        this.store.dispatch(addNewColumnModalVisible({ addNewColumnModalVisible: true }));
    }

    showEditColumnModal(column: Column) {
        this.store.dispatch(editColumn({ editColumnModalVisible: true, column }));
    }

    deleteColumn(column: Column) {
        // ask for confirmation if not empty other wise delete simply
        this.store.dispatch(deleteColumn({ column }));
    }
}
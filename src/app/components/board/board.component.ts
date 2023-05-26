import { Component, HostBinding, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { addNewColumnModalVisible, createBoardModalVisible, toggleViewTask, updateTaskParentColumn } from "src/app/state/app.actions";
import { AppState, Board, Column, Task } from "src/app/state/app.state";

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
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
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

    openViewTaskModal(task: Task) {
        this.store.dispatch(toggleViewTask({ viewTaskModalVisible: true, task }));
    }

    getCompletedSubtasksCount(task: Task): number {
        if (!task || !task.subtasks) {
            return 0;
        }
        return task.subtasks.filter(st => st.isCompleted).length;
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDrop(event: DragEvent, newColumnId: string) {
        event.preventDefault();
        const droppedData = event.dataTransfer?.getData('text/plain');
        if (droppedData) {
            const task = JSON.parse(droppedData) as Task;
            // do not update if moved in same column
            if (task.parentColumnId !== newColumnId) {
                this.store.dispatch(updateTaskParentColumn({ task, newColumnId }));
            }
            // Handle the dropped subtask, e.g., update its column or perform any necessary actions
        }
    }

    onDragStart(event: DragEvent, task: Task) {
        // Set the data to be transferred during the drag operation
        event.dataTransfer?.setData('text/plain', JSON.stringify(task));
    }
}
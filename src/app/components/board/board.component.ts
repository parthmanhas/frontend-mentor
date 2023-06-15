import { Component, HostBinding } from "@angular/core";
import { Store } from "@ngrx/store";
import { TAB_MIN_WIDTH, TAB_MAX_WIDTH } from "src/app/constants/constants";
import { addNewColumnModalVisible, createBoardModalVisible, toggleViewTask, updateColumnTasks, updateTaskParentColumn } from "src/app/state/app.actions";
import { AppState, Board, Task } from "src/app/state/app.state";
import {
    CdkDragDrop,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {

    public sidebarVisible = false;
    public isMobile = false;

    @HostBinding('style')
    get translateBoard() {
        // get current size of window
        const windowWidth = window.innerWidth;

        if (this.isMobile) {
            return;
        }


        if (this.sidebarVisible) {
            return {
                transform: 'translateX(0)'
            }
        }
        else {
            return {
                transform: windowWidth >= TAB_MIN_WIDTH && windowWidth <= TAB_MAX_WIDTH && this.minOneColumnAvailable ? 'translateX(30vw)' : 'translateX(15vw)'
            }
        }
    }

    public currentBoard: Board | null = null;
    public minOneBoardAvailable = false;
    public minOneColumnAvailable = false;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
            this.sidebarVisible = state.app.sidebarVisible;
            this.minOneBoardAvailable = state.app.boards.length > 0;
            this.minOneColumnAvailable = (this.currentBoard?.columns?.length ?? -1) > 0;
            this.isMobile = state.app.isMobile || false;
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

    drop(event: any) {
        // console.log(event)
        const previousIndex = event.previousIndex;
        const currentIndex = event.currentIndex;
        if (event.previousContainer === event.container) {
            const currentColumnId = event.container.id;
            if (!this.currentBoard?.columns?.length) {
                console.error('No columns available');
                return;
            }
            const column = this.currentBoard.columns.find(c => c.id === currentColumnId);
            if (!column || !column.tasks) {
                console.error('No column found or no tasks available');
                return;
            }
            const updatedTasks = [...column.tasks]; // Create a copy of the tasks array
            moveItemInArray(updatedTasks, previousIndex, currentIndex);
            console.log(updatedTasks)
            this.store.dispatch(updateColumnTasks({ column: { ...column, tasks: updatedTasks } }));
            // column = { ...column, tasks: updatedTasks }; // Update the original tasks array with the modified copy

        } else {
            const task = event.item.data as Task;
            const newColumnId = event.container.id;
            this.store.dispatch(updateTaskParentColumn({ task, newColumnId }));
        }
    }

    onDragStart(event: DragEvent, task: Task) {
        // Set the data to be transferred during the drag operation
        event.dataTransfer?.setData('text/plain', JSON.stringify(task));
    }
}
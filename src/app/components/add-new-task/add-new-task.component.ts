import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addNewTask } from "src/app/state/app.actions";
import { AppState, Board, Subtask, Task } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
    selector: 'app-add-new-task',
    templateUrl: './add-new-task.component.html',
    styleUrls: ['./add-new-task.component.scss']
})
export class AddNewTaskComponent extends BaseModalComponent {
    override whenClickOccuredOutsideModal(): void {
        this.closeModalEvent.emit(true);
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-add-new-task') {
            return true;
        }
        return false;
    }
    override addFormControls(): void {
        this.form.addControl('title', new FormControl('', Validators.required));
        this.form.addControl('description', new FormControl('', Validators.required));
    }
    override submitWhenFormValid(): void {
        const task: Task = {
            id: uuidv4(),
            title: this.form.value['title'],
            description: this.form.value['description'],
            status: this.selectedOption,
            parentColumnName: this.selectedOption,
            parentBoardName: this.currentBoard!.name
        }
        Object.entries(this.form.value).forEach(([key, value]) => {
            if (key.indexOf('-subtask') >= 0) {
                const subtask: Subtask = {
                    id: uuidv4(),
                    title: value as string,
                    isCompleted: false,
                    parentTaskTitle: task.title,
                    parentColumnName: this.selectedOption,
                    parentBoardName: this.currentBoard!.name
                }
                task['subtasks'] = task['subtasks'] ? [...task['subtasks'], subtask] : [subtask];
            }
        });
        this.store.dispatch(addNewTask({ task }));
        Object.entries(this.form.value).forEach(([key, value]) => {
            if (key.indexOf('-subtask') >= 0) {
                this.form.removeControl(key);
            }
        })
        this.form.reset();
    }

    public currentBoard: Board | null = null;
    public selectedOption: string = '';

    // public options: string[] = ['Todo', 'Doing', 'Done'];
    public options: string[] = [];

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    constructor(private store: Store<{ app: AppState }>) {
        super();
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.options = this.currentBoard?.columns?.map(c => c.name) || [];
        });
    }

    addSubtask() {
        this.form.addControl(`${uuidv4()}-subtask`, new FormControl('', Validators.required));
    }

    removeSubtask(uuid: string): void {
        this.form.removeControl(uuid);
    }

    getFormControlsArray(): any[] {
        return Object.keys(this.form.controls).filter(key => key !== 'description' && key !== 'title');
    }

    selectOption(option: string) {
        this.selectedOption = option;
        this.isDropdownOpen = false;
    }

    get filteredOptions(): string[] {
        return this.options.filter(option => option !== this.selectedOption);
    }
}
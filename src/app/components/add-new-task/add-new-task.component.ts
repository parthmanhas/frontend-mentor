import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addNewTask } from "src/app/state/app.actions";
import { AppState, Board, Subtask, Task } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-add-new-task',
    templateUrl: './add-new-task.component.html',
    styleUrls: ['./add-new-task.component.scss']
})
export class AddNewTaskComponent {

    public currentBoard: Board | null = null;

    public isDropdownOpen: boolean = false;
    public selectedOption: string = '';

    // public options: string[] = ['Todo', 'Doing', 'Done'];
    public options: string[] = [];
    public form: FormGroup;

    public submitted = false;

    // private currentBoard: string;
    // private activeColumn: string;

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.closeModalEvent.emit(true);
        }
    }

    constructor(private store: Store<{ app: AppState }>) {
        this.form = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        });
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.options = this.currentBoard?.columns?.map(c => c.name) || [];
        });
    }

    isOutsideModalClicked(target: EventTarget | null): boolean {
        // Check if the target element or any of its parents have the "modal" class
        if (target instanceof Element && target.localName === 'app-add-new-task') {
            return true;
        }
        return false;
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

    createTask(): void {
        this.submitted = true;
        if (this.form.valid) {
            // create a task
            const task: Task = {
                title: this.form.value['title'],
                description: this.form.value['description'],
                status: this.selectedOption,
                parentColumnName: this.selectedOption,
                parentBoardName: this.currentBoard!.name
            }
            Object.entries(this.form.value).forEach(([key, value]) => {
                if (key.indexOf('-subtask') >= 0) {
                    const subtask: Subtask = {
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
            this.submitted = false;
            this.form.reset();

        } else {
            this.markFormControlsAsTouched();
        }
    }

    markFormControlsAsTouched() {
        Object.values(this.form.controls).forEach(control => {
            control.markAsDirty();
        });
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    selectOption(option: string) {
        this.selectedOption = option;
        this.isDropdownOpen = false;
    }

    get filteredOptions(): string[] {
        return this.options.filter(option => option !== this.selectedOption);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.submitted || false;
    }
}
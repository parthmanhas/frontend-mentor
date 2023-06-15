import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addNewTask, toggleAddNewTask } from "src/app/state/app.actions";
import { AppState, Board, Column, Task } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { TColumn, TForm, TSubtask } from "./add-new-task.types";

@Component({
    selector: 'app-add-new-task',
    templateUrl: './add-new-task.component.html',
    styleUrls: ['./add-new-task.component.scss']
})
export class AddNewTaskComponent extends BaseModalComponent<TForm> {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(toggleAddNewTask({ addNewTaskModalVisible: false }));
    }

    override submitWhenFormValid(): void {
        if(!this.currentBoard) {
            console.error('Board not found while submitting');
            return;
        }
        if(!this.form.value.selectedOption?.id) {
            console.error('No column selected');
            return;
        }
        const task: Task = this.form.value.task as Task;
        task.parentBoardId = this.currentBoard.id;
        task.parentColumnId = this.form.value.selectedOption.id;
        this.store.dispatch(addNewTask({ task, addNewTaskModalVisible: false }));
    }

    public currentBoard: Board | null = null;
    public currentColumn: Column | null | undefined = null;

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.store.select(state => state).subscribe(state => {
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
            this.currentColumn = this.currentBoard.columns?.filter(c => c.id === state.app.currentColumnId)[0];

            this.form = this.formBuilder.group({
                task: this.formBuilder.group({
                    id: [uuidv4(), Validators.required],
                    description: ['', Validators.required],
                    title: ['', Validators.required],
                    subtasks: this.formBuilder.array<TSubtask>([])
                }),
                selectedOption: this.formBuilder.group({
                    id: ['', Validators.required],
                    name: ['', Validators.required]
                }),
                columns: this.formBuilder.array<TColumn>([]),
            })

            this.currentBoard.columns?.forEach(c => {
                this.form.controls.columns.push(this.formBuilder.group({
                    name: c.name,
                    id: c.id
                }))
            })
            if(!this.columns.at(0)) {
                console.error('No Columns fetched from store');
                return;
            }
            this.selectedOption.setValue({
                id: this.columns.at(0).controls.id.value,
                name: this.columns.at(0).controls.name.value
            })
        });
    }

    get columns() {
        return this.form.controls.columns;
    }

    get subtasks() {
        return this.form.controls.task.controls.subtasks;
    }

    get task() {
        return this.form.controls.task;
    }

    addSubtask() {
        const subtask: TSubtask = this.formBuilder.group({
            id: new FormControl<string>(uuidv4(), Validators.required),
            title: new FormControl<string>(''),
            isCompleted: new FormControl<boolean>(false, Validators.required),
            parentTaskId: new FormControl<string>(uuidv4(), Validators.required),
            parentColumnId: new FormControl<string>(this.selectedOption.controls.id.value || '', Validators.required),
            parentBoardId: new FormControl<string>(this.currentBoard?.id || '', Validators.required),

        })
        this.subtasks.push(subtask)
    }

    removeSubtask(index: number): void {
        this.form.controls.task.controls.subtasks.removeAt(index);
    }

    getFormControlsArray(): any[] {
        return Object.keys(this.form.controls).filter(key => key !== 'description' && key !== 'title');
    }

    get selectedOption() {
        return this.form.controls.selectedOption;
    }

    getTitleControlFromSubtaskGroup(subtaskGroup: AbstractControl): FormControl {
        return subtaskGroup.get('title') as FormControl;
    }

    selectOption(option: AbstractControl) {
        this.selectedOption.controls.name?.setValue(option.value.name);
        this.selectedOption.controls.id?.setValue(option.value.id);
        this.isDropdownOpen = false;
    }

    get unselectedOptions(): FormGroup[] {
        return this.columns.controls.filter(c => c.controls.id.value !== this.selectedOption.controls.id.value);
    }
}
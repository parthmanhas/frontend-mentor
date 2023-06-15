import { Component } from "@angular/core";
import { FormControl, Validators, FormBuilder } from "@angular/forms";
import { Store } from "@ngrx/store";
import { deleteTask, toggleEditTask, toggleViewTask, updateSubtasksStatus, updateTask, updateTaskParentColumn } from "src/app/state/app.actions";
import { AppState, Board, Subtask, Task } from "src/app/state/app.state";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { TForm, TSubtask } from "./view-task.types";

@Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent extends BaseModalComponent<TForm> {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(toggleViewTask({ viewTaskModalVisible: false, task: this.task }));
    }

    override submitWhenFormValid(): void {
        throw new Error("Method not implemented.");
    }

    public task: Task | null = null;
    public completeSubtasks: Subtask[] = [];
    public incompleteSubtasks: Subtask[] = [];
    public currentBoard: Board | null = null;
    public showOptionsModal = false;
    public theme: string | undefined;

    public options: { columnId: string, name: string }[] | undefined = undefined;

    public deleteTaskModalVisible = false;

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.store.select(state => state).subscribe(state => {
            if (!state.app.currentTask) return;
            this.theme = state.app.theme;
            if (state.app.currentTask) {
                this.task = state.app.currentTask;
            }
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
            this.options = this.currentBoard.columns?.map(c => ({ columnId: c.id, name: c.name }));
            const selectedOption = this.options?.filter(option => option.columnId === this.task?.parentColumnId)[0];
            this.form = this.formBuilder.group({
                title: ['', Validators.required],
                description: ['', Validators.required],
                subtasks: this.formBuilder.array<TSubtask>([]),
                selectedOption: this.formBuilder.group({
                    name: ['', Validators.required],
                    columnId: ['', Validators.required]
                })
            })
            if (!this.task) {
                console.error('Task should not be empty');
                return;
            }
            this.form.controls.title.setValue(this.task.title);
            this.form.controls.description.setValue(this.task.description);
            this.form.controls.selectedOption.setValue({
                name: selectedOption?.name || '',
                columnId: selectedOption?.columnId || ''
            });
            this.subtasksFormArray.clear();
            this.task?.subtasks?.forEach((subtask) => {
                if (!this.task) {
                    console.error('Task should not be empty');
                    return;
                }
                this.subtasksFormArray.push(this.formBuilder.group({
                    id: [subtask.id],
                    isCompleted: [subtask.isCompleted],
                    title: [subtask.title],
                    parentTaskId: [this.task.id],
                    parentColumnId: [this.task.parentColumnId],
                    parentBoardId: [this.task.parentBoardId]
                }))
            });

            this.completeSubtasks = this.task?.subtasks?.filter(st => st.isCompleted) || [];
            this.incompleteSubtasks = this.task?.subtasks?.filter(st => !st.isCompleted) || [];
        })
    }

    get subtasksFormArray() {
        return this.form.controls.subtasks;
    }

    getTitleFormControl(index: number): FormControl {
        return this.subtasksFormArray?.at(index)?.get('title') as FormControl;
    }

    get filteredOptions() {
        return this.options?.filter(option => option.name !== this.selectedOption.get('name')?.value);
    }

    get selectedOption() {
        return this.form.controls.selectedOption;
    }

    get selectedOptionNameFormControl() {
        return this.selectedOption.controls.name;
    }

    selectOption(option: { columnId: string, name: string }) {
        if (!this.task) {
            console.error('No task to update');
            return;
        }
        this.isDropdownOpen = false;
        this.selectedOption?.setValue(option);
        this.store.dispatch(updateTaskParentColumn({ task: this.task, newColumnId: option.columnId }));
    }

    deleteTask() {
        if (!this.task) {
            console.error('No task to delete');
            return;
        }
        this.store.dispatch(deleteTask({ task: this.task, viewTaskModalVisible: false }));
        this.deleteTaskModalVisible = false;
    }

    save() {
        const task = { ...this.task, ...this.form.value } as Task;
        this.store.dispatch(updateTask({ task }));
    }

    toggleCheckbox(subtask: TSubtask): void {
        if (!this.task) {
            console.error('No task to update subtask checkbox');
            return;
        }
        subtask.controls.isCompleted.setValue(!subtask.controls.isCompleted.value);
        const subtasks = this.task.subtasks?.map(st => ({ ...st, isCompleted: this.form.value.subtasks?.filter(tst => tst.id === st.id)[0].isCompleted || false }));
        this.store.dispatch(updateSubtasksStatus({ task: { ...this.task, subtasks } }));
    }

    showEditTaskModal() {
        this.showOptionsModal = false;
        this.store.dispatch(toggleEditTask({ editTaskModalVisible: true }));
    }
}
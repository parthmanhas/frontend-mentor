import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { Store } from "@ngrx/store";
import { first } from "rxjs/operators";
import { addNewTask, deleteTask, toggleEditTask, toggleViewTask, updateSubtasksStatus, updateTask, updateTaskStatus } from "src/app/state/app.actions";
import { Board, AppState, Subtask, Task } from "src/app/state/app.state";
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent extends BaseModalComponent {
    override whenClickOccuredOutsideModal(): void {
        if (this.task?.parentColumnName !== this.selectedOption) {
            this.store.dispatch(updateTaskStatus({ task: this.task!, status: this.selectedOption }));
        }
        this.store.dispatch(updateSubtasksStatus({ task: { ...this.task!, subtasks: this.form.value['subtasks'] } }));
        this.store.dispatch(toggleViewTask({ viewTaskModalVisible: false, task: null }));
        this.form = this.formBuilder.group({
            subtasks: this.formBuilder.array<Subtask>([]),
            selectedOption: [] // alias: status, parentColmnName
        });
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-view-task') {
            return true;
        }

        return false;
    }
    override addFormControls(): void {
        this.form.addControl('title', new FormControl(''));
        this.form.addControl('description', new FormControl(''));
        this.form.addControl('subtasks', new FormArray([]));
        this.form.addControl('selectedOption', new FormControl('')); // alias: status, parentColmnName));

    }
    override submitWhenFormValid(): void {
        throw new Error("Method not implemented.");
    }

    public task: Task | undefined | null;

    public completeSubtasks: Subtask[] = [];
    public incompleteSubtasks: Subtask[] = [];

    public showOptionsModal = false;

    public options: string[] | undefined = [];

    public deleteTaskModalVisible = false;

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.store.select(state => state).subscribe(state => {
            this.task = state.app.currentTask;
            this.options = state.app.boards.filter(b => b.name === this.task?.parentBoardName)[0]?.columns?.map(c => c.name);
            this.form.get('selectedOption')?.setValue(this.task?.parentColumnName);
            this.form.get('title')?.setValue(this.task?.title);
            this.form.get('description')?.setValue(this.task?.description);
            this.subtasksFormArray.clear();
            this.task?.subtasks?.forEach((subtask) => {
                this.subtasksFormArray.push(this.formBuilder.group({
                    isCompleted: [subtask.isCompleted],
                    title: [subtask.title]
                }))
            });

            this.completeSubtasks = this.task?.subtasks?.filter(st => st.isCompleted) || [];
            this.incompleteSubtasks = this.task?.subtasks?.filter(st => !st.isCompleted) || [];
        })
    }

    get subtasksFormArray(): FormArray<FormGroup> {
        return this.form.get('subtasks') as FormArray<FormGroup>;
    }

    getTitleFormControl(index: number): FormControl {
        return this.subtasksFormArray?.at(index)?.get('title') as FormControl;
    }

    get filteredOptions(): string[] | undefined {
        return this.options?.filter(option => option !== this.selectedOption);
    }

    get selectedOption() {
        return this.form.get('selectedOption')?.value;
    }

    selectOption(option: string) {
        this.isDropdownOpen = false;
        this.form.get('selectedOption')?.setValue(option);
    }

    deleteTask() {
        this.store.dispatch(deleteTask({ task: this.task! }));
        this.deleteTaskModalVisible = false;
    }
    save() {
        const updatedTask = { ...this.task, ...this.form.value };
        this.store.dispatch(updateTask({ previousTask: this.task!, updatedTask }));
    }

    toggleCheckbox(index: number): void {
        const subtaskFormGroup = this.subtasksFormArray.at(index);
        const isCompletedControl = subtaskFormGroup.get('isCompleted');

        if (isCompletedControl) {
            isCompletedControl.setValue(!isCompletedControl.value);
        }
    }

    showEditTaskModal() {
        this.showOptionsModal = false;
        this.store.dispatch(toggleEditTask({ editTaskModalVisible: true, task: undefined }));
    }
}
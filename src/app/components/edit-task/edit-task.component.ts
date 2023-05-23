import { Component } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { first } from "rxjs";
import { AppState, Task } from "src/app/state/app.state";
import { setCurrentTask, toggleEditTask, updateTask, updateTaskStatus } from "src/app/state/app.actions";

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent extends BaseModalComponent {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(toggleEditTask({ editTaskModalVisible: false, task: undefined }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-edit-task') {
            return true;
        }
        return false;
    }
    override addFormControls(): void {
        this.form.addControl('title', new FormControl('', Validators.required));
        this.form.addControl('description', new FormControl('', Validators.required));
        this.form.addControl('subtasks', new FormArray([]));
        this.form.addControl('selectedOption', new FormControl('', Validators.required)); // alias: status, parentColmnName));
    }
    override submitWhenFormValid(): void {
        const updatedTask: Task = { ...this.task, ...this.form.value, parentColumnName: this.form.value.selectedOption };
        this.store.dispatch(updateTask({ previousTask: this.task!, updatedTask }));
        // updatedTask is now existing task
        this.store.dispatch(updateTaskStatus({ task: updatedTask, status: this.form.value.selectedOption }));
        this.store.dispatch(toggleEditTask({ editTaskModalVisible: false, task: undefined }));
        this.store.dispatch(setCurrentTask({ task: updatedTask }));
    }

    public edit = false;
    public task: Task | null | undefined;
    public options: string[] | undefined = [];

    get subtasksFormArray(): FormArray<FormGroup> {
        return this.form.get('subtasks') as FormArray<FormGroup>;
    }

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.store.select(state => state).pipe(first()).subscribe(state => {
            this.task = state.app.currentTask;
            this.options = state.app.boards.filter(b => b.name === this.task?.parentBoardName)[0]?.columns?.map(c => c.name);
            this.form.get('selectedOption')?.setValue(this.task?.parentColumnName);
            this.form.get('title')?.setValue(this.task?.title);
            this.form.get('description')?.setValue(this.task?.description);
            this.task?.subtasks?.forEach((subtask) => {
                this.subtasksFormArray.push(this.formBuilder.group({
                    isCompleted: [subtask.isCompleted],
                    title: [subtask.title, Validators.required]
                }))
            });
        })
    }

    get filteredOptions(): string[] | undefined {
        return this.options?.filter(option => option !== this.selectedOption);
    }

    get selectedOption() {
        return this.form.get('selectedOption')?.value;
    }

    getTitleFormControl(index: number): FormControl {
        return this.subtasksFormArray?.at(index)?.get('title') as FormControl;
    }

    selectOption(option: string) {
        this.isDropdownOpen = false;
        this.form.get('selectedOption')?.setValue(option);
    }

    toggleCheckbox(index: number): void {
        const subtaskFormGroup = this.subtasksFormArray.at(index);
        const isCompletedControl = subtaskFormGroup.get('isCompleted');

        if (isCompletedControl) {
            isCompletedControl.setValue(!isCompletedControl.value);
        }
    }

    removeSubtask(index: number) {
        this.subtasksFormArray.removeAt(index);
    }

    getSubtaskTitleFormControl(index: number): FormControl {
        return this.subtasksFormArray.at(index).get('title') as FormControl;
    }

    addSubtask() {
        this.subtasksFormArray.push(this.formBuilder.group({
            isCompleted: [false],
            title: ['', Validators.required]
        }))
    }

}
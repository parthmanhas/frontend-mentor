import { Component } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState, Subtask, Task } from "src/app/state/app.state";
import { addNewTask, deleteTask, setCurrentTask, toggleEditTask, updateTask, updateTaskParentColumn } from "src/app/state/app.actions";
import { v4 as uuidv4 } from 'uuid';

type TDropdown = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>,
    active: FormControl<boolean | null>
}>

type TSubtask = FormGroup<{
    id: FormControl<string | null>,
    title: FormControl<string | null>,
    isCompleted: FormControl<boolean | null>
    parentTaskId: FormControl<string | null>,
    parentColumnId: FormControl<string | null>,
    parentBoardId: FormControl<string | null>
}>

type TForm = {
    title: FormControl<string | null>,
    description: FormControl<string | null>,
    subtasks: FormArray<TSubtask>,
    dropdown: FormArray<TDropdown>,
}

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent extends BaseModalComponent<TForm> {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(toggleEditTask({ editTaskModalVisible: false }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-edit-task') {
            return true;
        }
        return false;
    }

    override submitWhenFormValid(): void {
        const activeColumn = this.getActiveDropDownOptionFormGroup();
        const parentColumnId = activeColumn.controls.id.value!;
        const task: Task = { ...this.task, parentColumnId, title: this.form.value.title!, description: this.form.value.description! };
        task.subtasks = this.form.value.subtasks?.map(st => ({ ...st, parentColumnId })) as Subtask[];
        this.store.dispatch(deleteTask({ task: this.task! }));
        this.store.dispatch(addNewTask({ task }));
        this.store.dispatch(setCurrentTask({ task }));
        // this.store.dispatch(updateTask({ task }));
        // updatedTask is now existing task
        // this.store.dispatch(updateTaskParentColumn({ task: updatedTask, newColumnId: this.form.value.selectedOption }));
        this.store.dispatch(toggleEditTask({ editTaskModalVisible: false }));
        // this.store.dispatch(setCurrentTask({ task: updatedTask }));
    }

    public edit = false;
    public task!: Task; // initialized in store subscription
    public options: string[] | undefined = [];



    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.store.select(state => state).subscribe(state => {
            if (!state.app.currentTask) return;
            console.log(state.app.viewTaskModalVisible);
            this.task = state.app.currentTask;
            this.form = this.formBuilder.group({
                title: ['', Validators.required],
                description: ['', Validators.required],
                dropdown: this.formBuilder.array<TDropdown>([]),
                subtasks: this.formBuilder.array<TSubtask>([])
            })
            const dropdownOptions = state.app.boards.filter(b => b.id === this.task?.parentBoardId)[0]?.columns?.map(c => ({ name: c.name, id: c.id }));
            // populate dropdown options
            dropdownOptions?.forEach(option => {
                this.form.controls.dropdown.push(this.formBuilder.group({
                    id: [option.id, Validators.required],
                    name: [option.name, Validators.required],
                    active: [this.task?.parentColumnId === option.id, Validators.required]
                }))
            })
            this.form.controls.title.setValue(this.task.title);
            this.form.controls.description.setValue(this.task.description);
            this.task?.subtasks?.forEach((subtask) => {
                this.form.controls.subtasks.push(this.formBuilder.group({
                    id: [subtask.id, Validators.required],
                    title: [subtask.title, Validators.required],
                    isCompleted: [subtask.isCompleted, Validators.required],
                    parentTaskId: [subtask.parentTaskId, Validators.required],
                    parentColumnId: [subtask.parentColumnId, Validators.required],
                    parentBoardId: [subtask.parentBoardId, Validators.required]
                }))
            });
        })
    }

    get dropdown() {
        return this.form.controls.dropdown;
    }

    get subtasks() {
        return this.form.controls.subtasks;
    }

    getTitleFormControl(index: number) {
        return this.subtasks?.at(index)?.controls.title;
    }

    getActiveDropDownOptionFormGroup() {
        const index = this.dropdown.controls.findIndex(control => control.controls.active.value === true);
        return this.dropdown.at(index);
    }

    getInActiveDropDownOptionsFormArray() {
        return this.dropdown.controls.filter(control => control.value.active === false);
    }

    getOptionName(formGroup: TDropdown): string {
        return formGroup.controls.name.value || '';
    }

    getOptionId(formGroup: TDropdown): string {
        return formGroup.controls.id.value || '';
    }

    selectOption(optionId: string) {
        this.isDropdownOpen = false;
        this.dropdown.controls.forEach((control, index) => {
            if (control.get('id')?.value === optionId) {
                this.dropdown.at(index).patchValue({ active: true })
            } else {
                this.dropdown.at(index).patchValue({ active: false })
            }
        });
    }

    toggleCheckbox(index: number): void {
        const subtaskFormGroup = this.subtasks.at(index);
        const isCompletedControl = subtaskFormGroup.controls.isCompleted;

        if (isCompletedControl) {
            isCompletedControl.setValue(!isCompletedControl.value);
        }
    }

    removeSubtask(index: number) {
        this.subtasks.removeAt(index);
    }

    getSubtaskTitleFormControl(index: number) {
        return this.subtasks.at(index).controls.title;
    }

    addSubtask() {
        this.subtasks.push(this.formBuilder.group({
            id: [uuidv4(), Validators.required],
            title: ['', Validators.required],
            isCompleted: [false, Validators.required],
            parentTaskId: [this.task.id, Validators.required],
            parentColumnId: [this.getActiveDropDownOptionFormGroup().controls.id, Validators.required],
            parentBoardId: [this.task.parentBoardId]
        }))
    }

}
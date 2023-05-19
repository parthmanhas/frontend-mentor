import { Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addNewTask } from "src/app/state/app.actions";
import { Board, AppState, Subtask, Task } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent {

    @Input()
    public task: Task = {
        title: "Research pricing points of various competitors and trial different business models",
        description: "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
        status: "Doing",
        parentColumnName: "",
        parentBoardName: "",
        subtasks: [
            { title: 'Research competitor pricing and business models', isCompleted: false, parentBoardName: '', parentColumnName: '', parentTaskTitle: '' },
            { title: 'Outline a business model that works for our solution', isCompleted: false, parentBoardName: '', parentColumnName: '', parentTaskTitle: '' },
            { title: 'Talk to potential customers about our proposed solution and ask for fair price expectancy', isCompleted: false, parentBoardName: '', parentColumnName: '', parentTaskTitle: '' }
        ]
    };

    public currentBoard: Board | null = null;

    public completeSubtasks: Subtask[];
    public incompleteSubtasks: Subtask[];

    public options: string[] = [];

    public isDropdownOpen: boolean = false;
    public selectedOption: string = '';
    public form: FormGroup;

    public submitted = false;

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.closeModalEvent.emit(true);
        }
    }

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            subtasks: this.formBuilder.array<{ isCompleted: boolean, title: string }>([])
        });
        // const subtasksFormArray = this.form.get('subtasks') as FormArray;
        this.task.subtasks?.forEach((subtask) => {
            // const subtaskFormGroup = this.formBuilder.group({
            //     title: [subtask.title],
            //     isCompleted: [subtask.isCompleted]
            // });
            // subtasksFormArray.push(subtaskFormGroup);
            this.subtasksFormArray.push(this.formBuilder.group({
                isCompleted: [subtask.isCompleted],
                title: [subtask.title]
            }))
        });
        console.log(this.form)
        this.form.valueChanges.subscribe(val => {
            // this.store.dispatch(updateSubtask({ subtask }));
        })
        this.completeSubtasks = this.task.subtasks?.filter(st => st.isCompleted) || [];
        this.incompleteSubtasks = this.task.subtasks?.filter(st => !st.isCompleted) || [];
    }

    isOutsideModalClicked(target: EventTarget | null): boolean {
        // Check if the target element or any of its parents have the "modal" class
        if (target instanceof Element && target.localName === 'app-add-new-task') {
            return true;
        }
        return false;
    }

    get subtasksFormArray(): FormArray<FormGroup> {
        return this.form.get('subtasks') as FormArray<FormGroup>;
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    get filteredOptions(): string[] {
        return this.options.filter(option => option !== this.selectedOption);
    }

    selectOption(option: string) {
        this.selectedOption = option;
        this.isDropdownOpen = false;
    }
}
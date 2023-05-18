import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-add-new-task',
    templateUrl: './add-new-task.component.html',
    styleUrls: ['./add-new-task.component.scss']
})
export class AddNewTaskComponent {

    public isDropdownOpen: boolean = false;
    public selectedOption: string = 'Todo';

    public options: string[] = ['Todo', 'Doing', 'Done'];
    public form: UntypedFormGroup;

    private submitted = false;

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.closeModalEvent.emit(true);
        }
    }

    constructor() {
        this.form = new UntypedFormGroup({
            title: new UntypedFormControl('', Validators.required),
            description: new UntypedFormControl('', Validators.required)
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
        this.form.addControl(uuidv4(), new UntypedFormControl('', Validators.required));
    }

    removeSubtask(uuid: string): void {
        this.form.removeControl(uuid);
    }

    getFormControlsArray(): any[] {
        return Object.keys(this.form.controls).filter(key => key !== 'description' && key !== 'title');
    }

    createTask(): void {
        console.log(this.form)
        this.submitted = true;
        if (this.form.valid) {
            // create a task
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
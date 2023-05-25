import { Component, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormArrayName, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    template: ''
})
export abstract class BaseModalComponent<T extends { [K in keyof T]: AbstractControl<any, any>; }> {

    public form!: FormGroup<T>;
    public isDropdownOpen: boolean = false;
    public submitted = false;

    abstract whenClickOccuredOutsideModal(): void;
    abstract checkIfOutsideModalClicked(target: EventTarget | null): boolean;
    // abstract addFormControls(): void;
    abstract submitWhenFormValid(): void;

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.whenClickOccuredOutsideModal();
        }
    }

    isOutsideModalClicked(target: EventTarget | null): boolean {
        return this.checkIfOutsideModalClicked(target);
    }

    constructor() {
        // this.addFormControls();
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.submitted || false;
    }

    // valid only for level 1 nesting
    isControlInvalidFormGroup(formGroupName: string, controlName: string) {
        const control = this.form.get(formGroupName)?.get(controlName);
        return control?.invalid && this.submitted || false;
    }

    isControlInvalidByIndex(controlName:string, index: number): boolean {
        const control = (this.form?.get(controlName) as FormArray)?.at(index);
        return control?.invalid && this.submitted || false;
    }

    markFormControlsAsTouched() {
        Object.values(this.form.controls).forEach(control => {
            control.markAsDirty();
        });
    }

    submit() {
        this.submitted = true;
        if (this.form.valid) {
            this.submitWhenFormValid();
            this.submitted = false;
        } else {
            this.markFormControlsAsTouched();
        }
    }
}
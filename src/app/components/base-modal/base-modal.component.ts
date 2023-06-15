import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

@Component({
    template: ''
})
export abstract class BaseModalComponent<T extends { [K in keyof T]: AbstractControl<any, any>; }> implements AfterViewInit {

    public form!: FormGroup<T>;
    public isDropdownOpen = false;
    public submitted = false;

    @ViewChild('modal')
    modal: ElementRef<HTMLDialogElement> | undefined;

    abstract whenClickOccuredOutsideModal(): void;
    abstract submitWhenFormValid(): void;

    ngAfterViewInit(): void {
        if (!this.modal) {
            console.error('Modal is not defined');
            return;
        }
        this.modal.nativeElement.addEventListener('click', (e) => {
            if (!this.modal) {
                console.error('Modal is not defined');
                return;
            }
            const dialogDimensions = this.modal.nativeElement.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                this.modal.nativeElement.close();
                this.whenClickOccuredOutsideModal();
            }
        });
        this.modal.nativeElement.showModal();
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

    isControlInvalidByIndex(controlName: string, index: number): boolean {
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
import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addBoard, createBoardModalVisible } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-add-new-board',
    templateUrl: './add-new-board.component.html',
    styleUrls: ['./add-new-board.component.scss']
})
export class AddNewBoardComponent {
    public isDropdownOpen: boolean = false;
    public form: FormGroup;

    private submitted = false;

    // private currentBoard: string;
    // private activeColumn: string;

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: false }));
        }
    }

    constructor(private store: Store<{ app: AppState }>) {
        this.form = new FormGroup({
            name: new FormControl('', Validators.required)
        });
    }

    isOutsideModalClicked(target: EventTarget | null): boolean {
        // Check if the target element or any of its parents have the "modal" class
        if (target instanceof Element && target.localName === 'app-add-new-board') {
            return true;
        }
        return false;
    }



    addColumn() {
        this.form.addControl(uuidv4(), new FormControl(null, Validators.required));
    }

    removeColumn(uuid: string): void {
        this.form.removeControl(uuid);
    }

    getFormControlsArray(): any[] {
        return Object.keys(this.form.controls).filter(key => key !== 'name');
    }

    createBoard(): void {
        this.submitted = true;
        if (this.form.valid) {
            // create a board
            const board: Board = {
                name: '',
                columns: []
            };
            Object.entries(this.form.value).forEach(([key, value]) => {
                if (key === 'name') board['name'] = value as string;
                else board.columns!.push({
                    name: value as string,
                    parentBoardName: board.name
                })
            });
            this.store.dispatch(addBoard({ board }));
            this.form = new FormGroup({
                name: new FormControl('', Validators.required)
            });
            this.submitted = false;
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

    isControlInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.submitted || false;
    }
}

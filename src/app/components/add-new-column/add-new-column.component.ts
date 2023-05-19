import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addBoard, addColumn, addNewColumnModalVisible } from "src/app/state/app.actions";
import { AppState, Board, Column } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-add-new-column',
    templateUrl: './add-new-column.component.html',
    styleUrls: ['./add-new-column.component.scss']
})
export class AddNewColumnComponent {
    public isDropdownOpen: boolean = false;
    public form: FormGroup;

    public currentBoard: Board | null = null;

    public submitted = false;
    public hasFormControls = false;


    // private currentBoard: string;
    // private activeColumn: string;

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.store.dispatch(addNewColumnModalVisible({ addNewColumnModalVisible: false }));
        }
    }

    constructor(private store: Store<{ app: AppState }>) {
        this.form = new FormGroup({
        });
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
        });
    }

    isOutsideModalClicked(target: EventTarget | null): boolean {
        // Check if the target element or any of its parents have the "modal" class
        if (target instanceof Element && target.localName === 'app-add-new-column') {
            return true;
        }
        return false;
    }

    addColumn() {
        const columnFormControl = new FormControl(null, Validators.required);
        columnFormControl.valueChanges.subscribe(value => {
            this.submitted = false;
        })
        this.form.addControl(uuidv4(), columnFormControl);
    }

    removeColumn(uuid: string): void {
        this.form.removeControl(uuid);
    }

    getFormControlsArray(): any[] {
        return Object.keys(this.form.controls);
    }

    addNewColumn(): void {
        this.submitted = true;
        this.hasFormControls = Object.keys(this.form.controls).length > 0;;
        if (this.form.valid && this.hasFormControls) {
            // create a board
            const columns: Column[] = [];
            Object.entries(this.form.value).forEach(([key, value]) => {
                columns.push({
                    name: value as string,
                    parentBoardName: this.currentBoard!.name
                })
            });
            this.form = new FormGroup({
            });
            this.store.dispatch(addColumn({ columns }));
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

    isControlInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.submitted || false;
    }
}
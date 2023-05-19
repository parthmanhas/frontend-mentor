import { Component, HostListener } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Store } from "@ngrx/store";
import { AppState, Board, Column } from "src/app/state/app.state";
import { editColumn, updateColumnName } from "src/app/state/app.actions";
@Component({
    selector: 'app-edit-column',
    templateUrl: './edit-column.component.html',
    styleUrls: ['./edit-column.component.scss']
})
export class EditColumnComponent {
    public uuid: string;
    public form!: FormGroup;
    private currentBoard: Board | null = null;
    private currentColumn: Column | undefined = undefined;
    private currentColumnName: string | undefined = undefined;
    public submitted = false;


    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isOutsideModalClicked(event.target)) {
            // Click occurred outside the modal
            this.store.dispatch(editColumn({ editColumnModalVisible: false }));
        }
    }


    constructor(private store: Store<{ app: AppState }>) {
        this.uuid = uuidv4();
        this.store.select(state => state).subscribe(state => {
            this.currentColumnName = state.app.currentColumn;
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.currentColumn = this.currentBoard.columns?.filter(c => c.name === this.currentColumnName)[0];
            this.form = new FormGroup({
                [this.uuid]: new FormControl(this.currentColumnName, Validators.required)
            })
        });
    }

    isOutsideModalClicked(target: EventTarget | null): boolean {
        // Check if the target element or any of its parents have the "modal" class
        if (target instanceof Element && target.localName === 'app-edit-column') {
            return true;
        }
        return false;
    }

    updateColumn() {
        this.submitted = true;
        if (this.form.valid) {
            this.store.dispatch(updateColumnName({
                currentColumn: this.currentColumn!,
                currentColumnName: this.currentColumnName!,
                latestColumnName: this.form.value[this.uuid]
            }));
            this.currentColumnName = this.form.value[this.uuid];
            this.submitted = false;
        } else {
            Object.values(this.form.controls).forEach(control => {
                control.markAsDirty();
            });
        }
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.submitted || false;
    }

}
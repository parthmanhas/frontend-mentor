import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addBoard, addColumn, addNewColumnModalVisible } from "src/app/state/app.actions";
import { AppState, Board, Column } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
    selector: 'app-add-new-column',
    templateUrl: './add-new-column.component.html',
    styleUrls: ['./add-new-column.component.scss']
})
export class AddNewColumnComponent extends BaseModalComponent {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(addNewColumnModalVisible({ addNewColumnModalVisible: false }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-add-new-column') {
            return true;
        }
        return false;
    }
    override addFormControls(): void {
    }

    public currentBoard: Board | null = null;
    public hasFormControls = false;

    constructor(private store: Store<{ app: AppState }>) {
        super();
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
        });
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

    override submitWhenFormValid(): void {
        this.hasFormControls = Object.keys(this.form.controls).length > 0;
        if (this.hasFormControls) {
            const columns: Column[] = [];
            Object.entries(this.form.value).forEach(([key, value]) => {
                columns.push({
                    id: uuidv4(),
                    name: value as string,
                    parentBoardName: this.currentBoard!.name
                })
            });
            this.form = new FormGroup({
            });
            this.store.dispatch(addColumn({ columns }));
        }
    }
}
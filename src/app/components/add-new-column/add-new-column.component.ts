import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addBoard, addColumn, addNewColumnModalVisible } from "src/app/state/app.actions";
import { AppState, Board, Column } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';
import { BaseModalComponent } from "../base-modal/base-modal.component";

type TColumn = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>
    parentBoardId: FormControl<string | null>
}>

type TForm = {
    columns: FormArray<TColumn>
}
@Component({
    selector: 'app-add-new-column',
    templateUrl: './add-new-column.component.html',
    styleUrls: ['./add-new-column.component.scss']
})
export class AddNewColumnComponent extends BaseModalComponent<TForm> {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(addNewColumnModalVisible({ addNewColumnModalVisible: false }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-add-new-column') {
            return true;
        }
        return false;
    }


    public currentBoard!: Board;
    public hasFormControls = false;

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.form = this.formBuilder.group({
            columns: this.formBuilder.array<TColumn>([])
        });
        this.store.select(state => state).subscribe(state => {
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
        });
    }

    addColumn() {
        // const columnFormControl = new FormControl(null, Validators.required);
        // columnFormControl.valueChanges.subscribe(value => {
        //     this.submitted = false;
        // })
        this.form.controls.columns.push(this.formBuilder.group({
            id: [uuidv4(), Validators.required],
            name: ['', Validators.required],
            parentBoardId: [this.currentBoard.id, Validators.required]
        }));
    }

    get columns() {
        return this.form.controls.columns.controls;
    }
    removeColumn(index: number): void {
        this.form.controls.columns.removeAt(index);
    }

    getFormControlsArray(): any[] {
        return Object.keys(this.form.controls);
    }

    override submitWhenFormValid(): void {
        this.store.dispatch(addColumn({ columns: this.form.value.columns as Column[] }));
    }
}
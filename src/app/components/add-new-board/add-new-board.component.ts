import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addBoard, createBoardModalVisible } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { TForm, TColumn } from "./add-new-board.types";
@Component({
    selector: 'app-add-new-board',
    templateUrl: './add-new-board.component.html',
    styleUrls: ['./add-new-board.component.scss']
})
export class AddNewBoardComponent extends BaseModalComponent<TForm> {


    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: false }));
    }

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.form = this.formBuilder.group({
            id: [uuidv4(), Validators.required],
            name: ['', Validators.required],
            columns: this.formBuilder.array<TColumn>([])
        });
    }

    addColumn() {
        const boardId = this.form.value.id;
        if (!boardId) throw new Error('Board Id is not defined');

        this.form.controls.columns.push(this.formBuilder.group({
            id: uuidv4(),
            name: ['', Validators.required],
            parentBoardId: [boardId, Validators.required]
        }));
    }

    get columns() {
        return this.form.controls.columns.controls;
    }

    removeColumn(index: number) {
        this.form.controls.columns.removeAt(index);
    }

    override submitWhenFormValid(): void {
        this.store.dispatch(addBoard({ board: this.form.value as Board }));
        this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: false }));
    }
}

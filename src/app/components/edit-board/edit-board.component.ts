import { Component } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Store } from "@ngrx/store";
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AppState, Board, Column } from "src/app/state/app.state";
import { addColumn, deleteColumn, editBoard, selectBoard, updateBoard } from "src/app/state/app.actions";
import { v4 as uuidv4 } from 'uuid';


type TColumn = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>,
    parentBoardId: FormControl<string | null>,
    visible: FormControl<boolean | null>,
    delete: FormControl<boolean | null>
}>

type TBoard = FormGroup<{
    id: FormControl<string | null>,
    name: FormControl<string | null>
}>

type TForm = {
    board: TBoard,
    columns: FormArray<TColumn>
}

@Component({
    selector: 'app-edit-board',
    templateUrl: './edit-board.component.html',
    styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent extends BaseModalComponent<TForm> {

    public currentBoard!: Board;

    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(editBoard({ editBoardModalVisible: false }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-edit-board') {
            return true;
        }
        return false;
    }

    override submitWhenFormValid(): void {
        // console.log(this.form.value)
        const toDelete = this.form.value.columns?.filter(c => c.delete === true);
        const toAdd = this.form.value.columns?.filter(c => c.delete === false);
        this.store.dispatch(
            updateBoard({
                boardId: this.currentBoard?.id!,
                latestBoardName: this.form.value.board!.name!,
                columns: toAdd?.map(c => ({ id: c.id!, name: c.name!, parentBoardId: c.parentBoardId! }))
            })
        );
        toDelete?.forEach(c => {
            this.store.dispatch(deleteColumn({ column: { id: c.id!, name: c.name!, parentBoardId: c.parentBoardId! } }));
        })
    }


    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.form = this.formBuilder.group({
            board: this.formBuilder.group({
                id: ['', Validators.required],
                name: ['', Validators.required]
            }),
            columns: this.formBuilder.array<TColumn>([])
        })
        this.store.select(state => state).subscribe(state => {
            if (!state.app.currentBoardId) return;
            this.currentBoard = state.app.boards.filter(b => b.id === state.app.currentBoardId)[0];
            this.columns.clear();
            this.currentBoard.columns?.forEach(column => {
                this.columns.push(this.formBuilder.group({
                    id: [column.id, Validators.required],
                    name: [column.name, Validators.required],
                    parentBoardId: [this.currentBoard.id, Validators.required],
                    visible: [true, Validators.required],
                    delete: [false, Validators.required]
                }));

            });
            this.board.setValue({
                name: this.currentBoard.name,
                id: this.currentBoard.id
            });
        });
    }

    get columns() {
        return this.form.controls.columns;
    }

    // getColumnName(index: number): FormControl {
    //     return this.columns.at(index).get('name') as FormControl;
    // }

    getColumnName(formGroup: TBoard): FormControl {
        return formGroup.controls.name;
    }

    get board() {
        return this.form.controls.board;
    }

    get boardName(): FormControl {
        return this.form.controls.board.controls.name;
    }

    get boardId(): FormControl {
        return this.board.controls.id;
    }

    addColumn() {
        const formGroup = this.formBuilder.group({
            id: [uuidv4(), Validators.required],
            name: ['', Validators.required],
            parentBoardId: [this.currentBoard?.id, Validators.required],
            visible: [true, Validators.required],
            delete: [false, Validators.required]
        })
        this.columns.push(formGroup);
    }

    get visibleColumns() {
        return this.columns.controls.filter(control => control.controls.visible.value === true);
    }

    removeColumn(id: string | null) {
        const index = this.columns.controls.findIndex(control => control.controls.id.value === id);
        this.columns.at(index).patchValue({ delete: true, visible: false });
    }

}
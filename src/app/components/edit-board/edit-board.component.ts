import { Component } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Store } from "@ngrx/store";
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { AppState, Board } from "src/app/state/app.state";
import { deleteColumn, editBoard, updateBoard } from "src/app/state/app.actions";
import { v4 as uuidv4 } from 'uuid';
import { TBoard, TColumn, TForm } from "./edit-board.types";

@Component({
    selector: 'app-edit-board',
    templateUrl: './edit-board.component.html',
    styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent extends BaseModalComponent<TForm> {

    public currentBoard: Board | null = null;

    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(editBoard({ editBoardModalVisible: false }));
    }

    override submitWhenFormValid(): void {
        // console.log(this.form.value)
        const toDelete = this.form.value.columns?.filter(c => c.delete === true);
        const toAdd = this.form.value.columns?.filter(c => c.delete === false);
        if (!this.currentBoard) {
            console.error('Board not found while submitting');
            return;
        }
        if (!this.form.value.board?.name) {
            console.error('Board name is null');
            return;
        }
        if (!toAdd) {
            console.error('No Column to add');
            return;
        }
        this.store.dispatch(
            updateBoard({
                boardId: this.currentBoard.id,
                latestBoardName: this.form.value.board.name,
                columns: toAdd.map(c => {
                    if (!c.id || !c.name || !c.parentBoardId) {
                        throw new Error('Column id, name or parentBoardId is null');
                    }
                    return { id: c.id, name: c.name, parentBoardId: c.parentBoardId };
                })
            })
        );
        toDelete?.forEach(c => {
            if (!c.id || !c.name || !c.parentBoardId) {
                throw new Error('Column id, name or parentBoardId is null');
            }
            this.store.dispatch(deleteColumn({ column: { id: c.id, name: c.name, parentBoardId: c.parentBoardId } }));
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
                if (!this.currentBoard) {
                    console.error('Board not found');
                    return;
                }
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
        if (!this.currentBoard) {
            console.error('Board not found');
            return;
        }
        const formGroup = this.formBuilder.group({
            id: [uuidv4(), Validators.required],
            name: ['', Validators.required],
            parentBoardId: [this.currentBoard.id, Validators.required],
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
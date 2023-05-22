import { Component } from "@angular/core";
import { BaseModalComponent } from "../base-modal/base-modal.component";
import { Store } from "@ngrx/store";
import { FormControl, FormArray, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AppState, Board, Column } from "src/app/state/app.state";
import { addColumn, editBoard, selectBoard, updateBoard } from "src/app/state/app.actions";

@Component({
    selector: 'app-edit-board',
    templateUrl: './edit-board.component.html',
    styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent extends BaseModalComponent {

    public currentBoard: Board | null = null;

    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(editBoard({ editBoardModalVisible: false }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-edit-board') {
            return true;
        }
        return false;
    }
    override addFormControls(): void {
        this.form.addControl('previousBoardName', new FormControl('', Validators.required));
        this.form.addControl('latestBoardName', new FormControl('', Validators.required));
        this.form.addControl('columns', new FormArray([]));
    }
    override submitWhenFormValid(): void {
        const newColumns: Column[] = this.form.value.columns.filter((c: any) => !c.previousName).map((c: any) => ({ name: c.latestName, parentBoardName: this.currentBoard!.name }));
        const existingColumns = this.form.value.columns.filter((c: any) => c.previousName && c.latestName && c.previousName !== c.latestName);
        if (newColumns.length > 0) {
            this.store.dispatch(addColumn({ columns: newColumns }));
        }

        this.store.dispatch(updateBoard({ previousBoardName: this.form.value.previousBoardName, latestBoardName: this.form.value.latestBoardName, columns: existingColumns }));

        this.store.dispatch(selectBoard({ boardName: this.form.value.latestBoardName }));

        this.form = this.formBuilder.group({
            previousBoardName: [this.currentBoard?.name, Validators.required],
            latestBoardName: [this.currentBoard?.name, Validators.required],
            columns: this.formBuilder.array([])
        })
        this.currentBoard?.columns?.forEach(column => {
            this.columnsFormArray.push(this.formBuilder.group({
                previousName: column.name,
                latestName: column.name
            }));
        });
    }

    constructor(private store: Store<{ app: AppState }>, private formBuilder: FormBuilder) {
        super();
        this.store.select(state => state).subscribe(state => {
            const currentBoardName = state.app.currentBoard;
            this.currentBoard = state.app.boards.filter(b => b.name === currentBoardName)[0];
            this.currentBoard.columns?.forEach(column => {
                this.columnsFormArray.push(this.formBuilder.group({
                    previousName: column.name,
                    latestName: column.name
                }));
            });

            this.form.get('previousBoardName')?.setValue(currentBoardName);
            this.form.get('latestBoardName')?.setValue(currentBoardName);
        });
    }

    get columnsFormArray(): FormArray<FormGroup> {
        return this.form.get('columns') as FormArray<FormGroup>;
    }

    getLatestNameFormControl(index: number): FormControl {
        return this.columnsFormArray.at(index).get('latestName') as FormControl;
    }

    addColumnFormControl() {
        this.columnsFormArray.push(this.formBuilder.group({
            previousName: '',
            latestName: ''
        }));
    }

    removeColumnInput(index: number) {
        this.columnsFormArray.removeAt(index);
    }

}
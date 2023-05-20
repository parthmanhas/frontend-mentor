import { Component, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { addBoard, createBoardModalVisible } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";
import { v4 as uuidv4 } from 'uuid';
import { BaseModalComponent } from "../base-modal/base-modal.component";

@Component({
    selector: 'app-add-new-board',
    templateUrl: './add-new-board.component.html',
    styleUrls: ['./add-new-board.component.scss']
})
export class AddNewBoardComponent extends BaseModalComponent {
    override whenClickOccuredOutsideModal(): void {
        this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: false }));
    }
    override checkIfOutsideModalClicked(target: EventTarget | null): boolean {
        if (target instanceof Element && target.localName === 'app-add-new-board') {
            return true;
        }
        return false;
    }
    override addFormControls(): void {
        this.form.addControl('name', new FormControl('', Validators.required));
    }

    @Output()
    public closeModalEvent = new EventEmitter<boolean>();

    constructor(private store: Store<{ app: AppState }>) {
        super();
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

    override submitWhenFormValid(): void {
        const board: Board = {
            id: uuidv4(),
            name: '',
            columns: []
        };
        Object.entries(this.form.value).forEach(([key, value]) => {
            if (key === 'name') board['name'] = value as string;
            else board.columns!.push({
                id: uuidv4(),
                name: value as string,
                parentBoardName: board.name
            })
        });
        this.store.dispatch(addBoard({ board }));
        this.form = new FormGroup({
            name: new FormControl('', Validators.required)
        });
    }
}

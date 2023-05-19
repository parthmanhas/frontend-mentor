import { Component, EventEmitter, HostBinding, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { createBoardModalVisible, selectBoard } from "src/app/state/app.actions";
import { AppState } from "src/app/state/app.state";

type Board = {
    name: String;
}

const mockedBoard = [
    { name: 'Platform Launch' },
    { name: 'Marketing Plan' },
    { name: 'Roadmap' },
]

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    @Output()
    hideSidebarEvent = new EventEmitter<boolean>();


    @HostBinding('style')
    get hideSidebarPosition() {
        if (this.hide) {
            return {
                transform: 'translateX(-100%)'
            }
        }
        else {
            return {
                transform: 'translateX(0)'
            }
        }
    }

    public hide = false;

    public boardList: Board[] = mockedBoard;
    public isActive = -1;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            this.boardList = state.app.boards;
        });
    }

    setActive(index: number): void {
        this.isActive = index;
        this.store.dispatch(selectBoard({ boardName: this.boardList[index].name as string }));
    }

    hideSidebar() {
        this.hide = !this.hide;
        this.hideSidebarEvent.emit(this.hide);
    }

    openCreateBoardModal() {
        this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: true }));
    }

}
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { MOBILE_MAX_WIDTH } from "src/app/constants/constants";
import { createBoardModalVisible, selectBoard } from "src/app/state/app.actions";
import { AppState, Board } from "src/app/state/app.state";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    public isMobile = false;

    @Output()
    hideSidebarEvent = new EventEmitter<boolean>();


    @HostBinding('style')
    get hideSidebarPosition() {

        if (this.isMobile && !this.sidebarVisible) {
            return {
                transform: 'translate(-50%, -200%)'
            }
        } else if (this.isMobile && this.sidebarVisible) {
            return {
                transform: 'translate(-50%, 0%)'
            }
        }

        if (this.hide) {
            return {
                transform: 'translateX(-100%)'
            }
        } else {
            return {
                transform: 'translateX(0)'
            }
        }
    }

    public hide = false;

    public boardList!: Board[];
    public isActive = -1;
    public activeBoardId!: string | null;
    public theme: string = 'light';
    public sidebarVisible = false;

    constructor(private store: Store<{ app: AppState }>, private elementRef: ElementRef) {
        this.store.select(state => state).subscribe(state => {
            this.boardList = state.app.boards;
            this.activeBoardId = state.app.currentBoardId;
            this.theme = state.app.theme
            this.sidebarVisible = state.app.sidebarVisible;
            this.isMobile = state.app.isMobile || false;
            this.elementRef.nativeElement.style.top = `${state.app.mobileCss?.top}px`;
            console.log(this.elementRef.nativeElement.style)
        });
    }

    setActive(index: number): void {
        this.isActive = index;
        this.store.dispatch(selectBoard({ boardId: this.boardList[index].id }));
    }

    hideSidebar() {
        this.hide = !this.hide;
        this.hideSidebarEvent.emit(this.hide);
    }

    openCreateBoardModal() {
        this.store.dispatch(createBoardModalVisible({ createBoardModalVisible: true }));
    }



}
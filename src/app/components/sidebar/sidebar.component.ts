import { Component, EventEmitter, HostBinding, Output } from "@angular/core";

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
    public isActive = 0;

    setActive(index: number): void {
        this.isActive = index;
    }

    hideSidebar() {
        this.hide = !this.hide;
        this.hideSidebarEvent.emit(this.hide);
    }

}
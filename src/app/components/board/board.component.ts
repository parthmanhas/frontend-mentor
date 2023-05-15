import { Component, HostBinding, Input } from "@angular/core";

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {
    @Input()
    public sidebarVisible = false;

    @HostBinding('style')
    get translateBoard() {
        if (this.sidebarVisible) {
            return {
                transform: 'translateX(0)'
            }
        }
        else {
            return {
                transform: 'translateX(15vw)'
            }
        }
    }
}
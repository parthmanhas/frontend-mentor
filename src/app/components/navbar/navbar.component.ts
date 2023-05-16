import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    @Output()
    public createNewTask = new EventEmitter<boolean>();

    public addNewTaskButtonDisabled = false;

    public buttonClick(buttonName: string): void {
        if (buttonName === 'addNewTask') {
            this.createNewTask.emit(true);
        }
    }
}
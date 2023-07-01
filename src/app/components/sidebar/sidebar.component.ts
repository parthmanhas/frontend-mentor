import { Component } from "@angular/core";
import { AppComponent } from "src/app/app.component";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

    constructor(public appComponent: AppComponent) {

    }

    toggleTheme(theme: 'light' | 'dark') {
        this.appComponent.theme$.next(theme);
    }

}
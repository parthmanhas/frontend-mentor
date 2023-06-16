import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/state/app.state";

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
    public theme: string = 'light';
    public mobile: boolean = false;

    constructor(private store: Store<{ app: AppState }>) {
        this.store.select(state => state).subscribe(state => {
            this.theme = state.app.theme
            this.mobile = state.app.isMobile || false;
        });
    }

}
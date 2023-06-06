import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { changeTheme } from "src/app/state/app.actions";
import { AppState } from "src/app/state/app.state";

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

    public theme: boolean = false;

    constructor(private store: Store<{ app: AppState }>) { }

    changeTheme(value: boolean) {
        this.store.dispatch(changeTheme({ theme: value ? 'dark' : 'light' }))
    }

}
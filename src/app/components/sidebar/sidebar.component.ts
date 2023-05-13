import { Component } from "@angular/core";

type Board = {
    name: String;
}

// const mockedBoard = [
//     {name: 'Platform Launch'},
//     {name: 'Marketing Plan'},
//     {name: 'Roadmap'},
// ]

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    public boardList: Board[] = [];

}
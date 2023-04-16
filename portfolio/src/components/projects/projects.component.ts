import { Component, Input } from "@angular/core";
import { IProject } from "../project/project.component";

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

    @Input()
    public projects: IProject[] = [];

}
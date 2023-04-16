import { Component } from "@angular/core";
import { IProject } from "src/components/project/project.component";
import { ISkill } from "src/components/skill/skill.component";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public skills: ISkill[] = [
        {
            name: 'HTML',
            experience: '3 years Experience',
            hoverColor: 'orange'
        },
        {
            name: 'CSS',
            experience: '3 years Experience',
            hoverColor: 'blue'
        },
        {
            name: 'SCSS',
            experience: '3 years Experience',
            hoverColor: 'red'
        },
        {
            name: 'JavaScript',
            experience: '3 years Experience',
            hoverColor: 'yellow'
        },
        {
            name: 'TypeScript',
            experience: '3 years Experience',
            hoverColor: 'blue'
        },
        {
            name: 'Angular',
            experience: '3 years Experience',
            hoverColor: 'red'
        },
        {
            name: 'Express',
            experience: '3 years Experience',
            hoverColor: 'green'
        },
    ]

    public projects: IProject[] = [
        { empty: true },
        { empty: true }
    ];

}
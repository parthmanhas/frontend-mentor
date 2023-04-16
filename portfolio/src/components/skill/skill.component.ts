import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.scss']
})
export class SkillComponent {
    
    public class = '';

    @Input()
    public skill!: ISkill;

    ngOnInit() {
        this.class = `skill hover-${this.skill.hoverColor}`;
    }


}

export interface ISkill {
    name: string;
    experience: string;
    hoverColor: string;
}
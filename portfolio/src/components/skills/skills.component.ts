import { Component, Input } from "@angular/core";
import { ISkill } from "../skill/skill.component";

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
    
    @Input()
    public skills: ISkill[] = [];
}
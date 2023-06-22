import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

    @Input()
    public theme: 'light' | 'dark' = 'light';

    @Input()
    size: 'small' | 'medium' | 'large' = 'medium';

    @Input()
    label = 'Button';

    @Input()
    public style: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'danger' = 'primary';

    @Input()
    public icon: 'plus-circle' | 'plus' | 'none' = 'none';

    @Input()
    onClickFn: Function = () => { };

    public get classes(): string[] {
        switch (this.style) {
            case 'tertiary':    
                return ['button', `button--${this.size}`, `button--tertiary--${this.theme === 'light' ? 'light' : 'dark'}`, this.theme];
            case 'quaternary':
                return ['button', `button--${this.size}`, `button--quaternary--${this.theme === 'light' ? 'light' : 'dark'}`, this.theme];
            default:
                return ['button', `button--${this.size}`, `button--${this.style}`];

        }
    }

    onClick() {
        if (!this.onClickFn) {
            console.error('No onClick function provided for button');
            return;
        }
        this.onClickFn();
    }
}
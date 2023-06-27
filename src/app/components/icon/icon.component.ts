import { Component, ElementRef, HostListener, Input, OnChanges, Renderer2 } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent {

    @Input()
    public path = '';

    @Input()
    public defaultColor = '#888EB0';

    @Input()
    public hoverColor = '';

    public src = '';

    @HostListener('mouseenter')
    onMouseEnter() {
        this.changeColor(this.hoverColor); // Change to the desired hover color
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.changeColor(this.defaultColor); // Change to the default color
    }

    constructor(private http: HttpClient, private elementRef: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        this.fetchIcon();
    }

    private fetchIcon() {
        this.http.get(this.path, { responseType: 'text' }).subscribe(
            {
                next: (svgData: string) => {
                    const parser = new DOMParser();
                    // replace fill="*" with fill="currentColor"
                    svgData = svgData.replace(/fill=".*?"/g, `fill="${this.defaultColor}"`);
                    const svgElement = parser.parseFromString(svgData, 'image/svg+xml').documentElement;
                    this.elementRef.nativeElement.appendChild(svgElement);
                },
                error: (error: any) => {
                    console.error(`Error fetching icon: ${error}`);
                }
            }
        );
    }

    private changeColor(color: string) {
        const svgElement = this.elementRef.nativeElement.querySelector('svg > path');
        this.renderer.setStyle(svgElement, 'fill', color);
    }
}
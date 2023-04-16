import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {


    @ViewChild('logo')
    public logo!: ElementRef;

    @ViewChild('blog')
    public blog!: ElementRef;

    @ViewChild('whatIDid')
    public whatIDid!: ElementRef;

    @ViewChild('rateMyWork')
    public rateMyWork!: ElementRef;

    public async scrambleLetters(
        correctOrder: string,
        currentText: string,
        element: HTMLElement,
        time: number,
        underline = false,
        wordRotationCount = 3) {
        const perInterationWidth = Math.ceil(element.clientWidth / correctOrder.length);
        let currentWidth = 0;
        const timer = (ms: number) => new Promise(res => setTimeout(res, ms));
        for (let i = 0; i < correctOrder.length; i++) {
            let j = 0;
            while (j < wordRotationCount) {
                const index = Math.floor(Math.random() * 100) % correctOrder.length;
                currentText = currentText.substring(0, i) + correctOrder[index] + currentText.substring(i + 1);
                element.textContent = currentText;
                await timer(time);
                j++;
            }
            currentText = currentText.substring(0, i) + correctOrder[i] + currentText.substring(i + 1);
            element.textContent = currentText;
            // if (underline && this.underline) {
            //     currentWidth += perInterationWidth;
            //     if (currentWidth > element.clientWidth) {
            //         currentWidth = element.clientWidth;
            //     }
            //     this.underline.nativeElement.style.width = `${currentWidth}px`;
            // }
        }
    }

    async ngAfterViewInit() {
        this.scrambleLetters('parthmanhas', this.logo.nativeElement.textContent, this.logo.nativeElement, 20);
        this.scrambleLetters('blog', this.blog.nativeElement.textContent, this.blog.nativeElement, 30);
        this.scrambleLetters('what I did today', this.whatIDid.nativeElement.textContent, this.whatIDid.nativeElement, 10);
        this.scrambleLetters('rate my work', this.rateMyWork.nativeElement.textContent, this.rateMyWork.nativeElement, 20);
    }
}
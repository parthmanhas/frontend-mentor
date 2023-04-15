import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html'
})
export class HeroComponent {

    @ViewChild('headingOne')
    public headingOne!: ElementRef;

    @ViewChild('headingTwo')
    public headingTwo!: ElementRef;

    @ViewChild('headingThree')
    public headingThree!: ElementRef;

    @ViewChild('description')
    public description!: ElementRef;

    @ViewChild('underline')
    public underline!: ElementRef;

    public timer = (ms: number) => new Promise(res => setTimeout(res, ms));

    public async scrambleLetters(
        correctOrder: string,
        currentText: string,
        element: HTMLElement,
        time: number,
        underline = false,
        wordRotationCount = 3) {
        const perInterationWidth = Math.ceil(element.clientWidth / correctOrder.length);
        let currentWidth = 0;
        for (let i = 0; i < correctOrder.length; i++) {
            let j = 0;
            while (j < wordRotationCount) {
                const index = Math.floor(Math.random() * 100) % correctOrder.length;
                currentText = currentText.substring(0, i) + correctOrder[index] + currentText.substring(i + 1);
                element.textContent = currentText;
                await this.timer(time);
                j++;
            }
            currentText = currentText.substring(0, i) + correctOrder[i] + currentText.substring(i + 1);
            element.textContent = currentText;
            if (underline && this.underline) {
                currentWidth += perInterationWidth;
                if (currentWidth > element.clientWidth) {
                    currentWidth = element.clientWidth;
                }
                this.underline.nativeElement.style.width = `${currentWidth}px`;
            }
        }
    }

    async ngAfterViewInit() {
        this.scrambleLetters('Nice to meet you!', this.headingOne.nativeElement.textContent, this.headingOne.nativeElement, 5);
        await this.timer(10);
        this.scrambleLetters('I am Parth Manhas.', this.headingTwo.nativeElement.textContent, this.headingTwo.nativeElement, 5, true);
    }

}
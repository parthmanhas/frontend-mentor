import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

const PUBLIC_KEY = 'QuKsI7P8KUIiXCqvo';
const TEMPLATE_ID = 'template_kvzyje8';
const SERVICE_ID = 'service_dzlgedv';
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

    @ViewChild('toastSuccess')
    public toastSuccess!: ElementRef;

    @ViewChild('toastError')
    public toastError!: ElementRef;

    public form: FormGroup;
    public nameInvalid = false;
    public emailInvalid = false;
    public messageInvalid = false;

    public formSubscription: Subscription = new Subscription();

    constructor() {
        this.form = new FormGroup({
            name: new FormControl('', {
                validators: [Validators.required],
                updateOn: 'change'
            }),
            email: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.email,
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ],
                updateOn: 'change'
            }),
            message: new FormControl('', {
                validators: [
                    Validators.required
                ],
                updateOn: 'change'
            })
        });
    }

    ngOnInit() {
        this.formSubscription = this.form.valueChanges.subscribe(val => {
            this.nameInvalid = this.form.controls['name'].invalid && (this.form.controls['name'].dirty || this.form.controls['name'].touched);
            this.emailInvalid = this.form.controls['email'].invalid && (this.form.controls['email'].dirty || this.form.controls['email'].touched);
            this.messageInvalid = this.form.controls['message'].invalid && (this.form.controls['message'].dirty || this.form.controls['message'].touched);
        });
    }

    ngOnDestroy() {
        this.formSubscription.unsubscribe();
    }

    public submit(event: Event) {
        event.preventDefault();
        if (this.form.valid) {
            const templateParams = {
                name: this.form.controls['name'].value,
                email: this.form.controls['email'].value,
                message: this.form.controls['message'].value
            }
            
            let dataSentSuccess = true;
            try {
                // send email to my account
                emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, event.target as HTMLFormElement, JSON.stringify(templateParams))
                    .then(function (response) {
                        dataSentSuccess = true;
                    }, function (error) {
                        dataSentSuccess = false;
                    });
            } catch (e) {
                console.error(e);
                dataSentSuccess = false;
            }


            dataSentSuccess ? 
            this.displayToast(this.toastSuccess.nativeElement, 'dataSendSuccess') : 
            this.displayToast(this.toastError.nativeElement, 'dataSendFail');
        } else {
            this.nameInvalid = this.form.controls['name'].invalid;
            this.emailInvalid = this.form.controls['email'].invalid;
            this.messageInvalid = this.form.controls['message'].invalid;
        }
    }

    public displayToast(toast: HTMLElement, event: string) {
        const lineDiv = document.createElement('div');
        if (event === 'dataSendSuccess') {
            toast.textContent = 'Message Sent Successfully!';
            lineDiv.classList.add('success-line');
        } else if (event === 'dataSendFail') {
            toast.textContent = 'Error Sending Message!';
            lineDiv.classList.add('error-line');
        } else if (event === 'dataSendingBefore15Min') {
            toast.textContent = 'Please try again after 15 minutes!';
            lineDiv.classList.add('error-line');
        }
        if ((!toast.style.display || toast.style.display === 'none')) {
            toast.style.animation = '';
            toast.style.display = 'inline-block';
            toast.appendChild(lineDiv);
            setTimeout(() => {
                toast.style.animation = 'fade 1s linear';
                const animationEndCleanup = () => {
                    toast.style.display = 'none';
                    toast.style.animation = '';
                    toast.removeEventListener('animationend', animationEndCleanup);
                }
                toast.addEventListener('animationend', animationEndCleanup);
            }, 1000);
        }
    }

}
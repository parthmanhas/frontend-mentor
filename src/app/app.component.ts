import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Invoice } from './types/types';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'invoice';

  theme$ = new BehaviorSubject<'light' | 'dark'>('dark');

  invoices$ = new BehaviorSubject<Invoice[]>([]);

  selectedInvoice$ = new BehaviorSubject<Invoice | null>(null);

  constructor(private renderer: Renderer2) {
    this.theme$.subscribe(theme => {
      const rootElement = this.renderer.parentNode(document.body);
      if (theme === 'dark') {
        this.renderer.addClass(rootElement, 'dark');
      } else {
        this.renderer.removeClass(rootElement, 'dark');
      }
    });
    this.generateInvoices();
  }

  // function to generate fake 50 invoices
  generateInvoices() {
    const invoices: Invoice[] = [];
    for (let i = 0; i < 50; i++) {
      const invoice: Invoice = {
        city: 'London',
        client: {
          name: `Client ${i}`,
          email: `client@gmail.com`,
          address: {
            street: '19 Union Terrace',
            city: 'London',
            country: 'United Kingdom',
            postCode: 'E1 3EZ'
          },
        },
        country: 'United Kingdom',
        createdAt: new Date(),
        id: i + '',
        // generate 10 random items
        items: Array.from({ length: 10 }).map((_, i) => ({
          name: `Item ${i}`,
          quantity: Math.floor(Math.random() * 10),
          price: Math.floor(Math.random() * 1000),
          total: Math.floor(Math.random() * 1000)
        })),
        paymentDueDate: formatDate(new Date(), 'YYYY-MM-dd', 'en'),
        postCode: 'E1 3EZ',
        projectName: `Project ${i}`,
        purchaseDate: formatDate(new Date(), 'YYYY-MM-dd', 'en'),
        status: ['paid', 'pending', 'draft'][Math.floor(Math.random() * 10) % 3] as 'paid' | 'pending' | 'draft',
        street: '19 Union Terrace',
      };
      invoices.push(invoice);
    }
    this.invoices$.next(invoices);
  }
}

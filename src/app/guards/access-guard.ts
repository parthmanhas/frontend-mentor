import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class AccessGuard {
    constructor(private router: Router) { }

    canActivate(): boolean {
        // Check if the route is accessed directly
        const navigationExtras = this.router.getCurrentNavigation()?.extras?.state;
        const fromViewInvoices = navigationExtras?.['fromViewInvoices'];

        const isDirectAccess = !fromViewInvoices;
        if (isDirectAccess) {
            // Redirect to the view-invoices route if accessed directly
            this.router.navigate(['/view-invoices']);
            return false;
        }

        return true;
    }
}

export const canActivateViewInvoice: CanActivateFn =
    () => {
        return inject(AccessGuard).canActivate();
    };
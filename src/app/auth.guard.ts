import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './components/service/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    const authenticated = await firstValueFrom(this.authService.isAuthenticated());
    if (!authenticated) {
      console.error('User not authenticated, please login first');
      this.router.navigate(['/login']);
    }
    return authenticated;
  }
}

export const canActivateDashboard: CanActivateFn = () => inject(AuthGuard).canActivate();
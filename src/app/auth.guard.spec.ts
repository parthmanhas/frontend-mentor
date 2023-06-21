// import { TestBed, waitForAsync, inject } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { AuthService } from './components/service/auth.service';
// import { of } from 'rxjs';
// import { Auth } from '@angular/fire/auth';
// import { Store } from '@ngrx/store';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let router: Router;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule.withRoutes([
//         { path: 'dashboard', component: DashboardComponent },
//       ])],
//       providers: [AuthService, Auth, Router, Store]
//     });

//     authService = TestBed.inject(AuthService);
//     router = TestBed.inject(Router);
//   });

//   it('should not allow access to /dashboard when user is null', waitForAsync(() => {
//     spyOn(router, 'navigateByUrl');
//     spyOn(authService, 'isAuthenticated').and.returnValue(of(false));
//     expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
//   }));

//   it('should allow access to /dashboard when user is not null', waitForAsync(() => {
//     spyOn(router, 'navigateByUrl');
//     spyOn(authService, 'isAuthenticated').and.returnValue(of(true));
//     expect(router.navigateByUrl).not.toHaveBeenCalledWith('/login');
//   }));
// });

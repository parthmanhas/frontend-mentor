import { Injectable } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { setUser } from 'src/app/state/app.actions';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private auth: Auth, private router: Router, private store: Store<AppState>) { }

    isAuthenticated(): Observable<boolean> {        
        return authState(this.auth).pipe(map(user => !!user));
    }

    async login(email: string, password: string) {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
            if (!userCredential.user.email) {
                alert('Please verify your email address');
                return;
            }
            const user = { id: userCredential.user.uid, email: userCredential.user.email };
            this.store.dispatch(setUser({ user }));
            const toCache = { ...user, date: new Date().getTime() };
            localStorage.setItem('kanban-user', JSON.stringify(toCache));
            this.router.navigate(['dashboard']);
        } catch (error) {
            const typedError = error as FirebaseError;
            if (typedError.code === 'auth/user-not-found') {
                console.error('User not found');
            } else if (typedError.code === 'auth/wrong-password') {
                console.error('Wrong password');
            } else {
                console.error(error);
            }
        }
    }

    async signup(email: string, password: string) {
        try {
            await createUserWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            const typedError = error as FirebaseError;
            if (typedError.code === 'auth/email-already-in-use') {
                console.error('Already Signed Up, Please login');
            } else if (typedError.code === 'auth/wrong-password') {
                console.error('Wrong password');
            } else {
                console.error(error);
            }
        }
    }

    logout() {
        this.auth.signOut()
            .then(() => this.router.navigateByUrl('/login'))
            .catch((err) => console.error(`error signing out: ${err}`));
    }
}
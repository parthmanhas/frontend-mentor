import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { MOBILE_MAX_WIDTH } from "src/app/constants/constants";
import { addAppState, toggleSidebar } from "src/app/state/app.actions";
import { AppState, MobileCss, User } from "src/app/state/app.state";
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { take, firstValueFrom } from "rxjs";

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    firestore: Firestore = inject(Firestore);

    public sidebarVisible = false;
    public addNewTaskModalVisible: boolean | undefined = false;
    public createNewBoard = false;
    public addNewColumnModalVisible = false;
    public editColumnModalVisible = false;
    public viewTaskModalVisible = false;
    public editBoardModalVisible = false;
    public editTaskModalVisible = false;
    public theme = 'light';
    public isMobile = false;


    @ViewChild('mobileBackground')
    public mobileBackground: ElementRef | undefined;

    mobileCss: MobileCss | undefined;

    constructor(private store: Store<{ app: AppState }>) {
    }

    ngOnInit() {
        this.fetchFromDatabase();
    }

    ngAfterViewInit() {
        this.store.select(state => state).subscribe(state => {
            this.createNewBoard = state.app.createBoardModalVisible;
            this.addNewTaskModalVisible = state.app.addNewTaskModalVisible;
            this.addNewColumnModalVisible = state.app.addNewColumnModalVisible;
            this.editColumnModalVisible = state.app.editColumnModalVisible;
            this.viewTaskModalVisible = state.app.viewTaskModalVisible;
            this.editBoardModalVisible = state.app.editBoardModalVisible;
            this.editTaskModalVisible = state.app.editTaskModalVisible;
            this.theme = state.app.theme
            this.isMobile = state.app.isMobile || false;
            this.sidebarVisible = state.app.sidebarVisible;
            this.mobileCss = state.app.mobileCss;

            if (this.mobileBackground && this.isMobile) {
                this.mobileBackground.nativeElement.style.display = this.sidebarVisible ? 'block' : 'none';
                this.mobileBackground.nativeElement.style.top = `${this.mobileCss?.top}px`;
            }
        });
    }

    async fetchFromDatabase() {
        const userId = (await firstValueFrom(this.store.select(state => state).pipe(take(1)))).app.user?.id;
        if (!userId) {
            console.error('User not found, please try refreshing again');
            return;
        }
        const userCollection = collection(this.firestore, `users`);
        const userRef = doc(this.firestore, 'users', userId);
        const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
        try {
            const snapshot = await getDoc(userRef);
            const user  = snapshot.data() as User;
            this.store.dispatch(addAppState({ appState: user.appState, isMobile }));

        } catch (error) {
            console.error(error);
        }
    }

    hideSidebarVisibleEvent() {
        this.sidebarVisible = !this.sidebarVisible;
        this.store.dispatch(toggleSidebar({ sidebarVisible: this.sidebarVisible }));
    }

}
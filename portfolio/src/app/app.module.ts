import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from 'src/pages/home/home.component';
import { ContactComponent } from 'src/components/contact/contact.component';
import { NavbarComponent } from 'src/components/navbar/navbar.component';
import { HeroComponent } from 'src/components/hero/hero.component';
import { ProjectComponent } from 'src/components/project/project.component';
import { ProjectsComponent } from 'src/components/projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    NavbarComponent,
    HeroComponent,
    ProjectComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

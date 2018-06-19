import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ModulesComponent } from './modules/modules.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { NavbarComponent } from './navbar/navbar.component';

const appRoutes: Routes = [
  { path: 'modules', component: ModulesComponent },
  { path: 'workflows', component: WorkflowsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    WorkflowsComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

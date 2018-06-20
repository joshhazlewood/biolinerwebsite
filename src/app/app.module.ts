import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ModulesComponent } from './modules/modules.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'modules', component: ModulesComponent },
  { path: 'workflows', component: WorkflowsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    WorkflowsComponent,
    ModulesComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ModulesComponent } from './modules/modules.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { NewModuleComponent } from './new-module/new-module.component';
import { ListModulesComponent } from './list-modules/list-modules.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'modules', component: ModulesComponent },
  { path: 'workflows', component: WorkflowsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    WorkflowsComponent,
    ModulesComponent,
    HomeComponent,
    NewModuleComponent,
    ListModulesComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

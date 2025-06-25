import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PolicyComponent } from './components/policy/policy.component';
import { PolicyFormDialogComponent } from './components/policy/policy-form-dialog/policy-form-dialog.component';
import { ClientComponent } from './components/client/client.component';
import { ClientFormDialogComponent } from './components/client/client-form-dialog/client-form-dialog.component';
import { ClientDetailsDialogComponent } from './components/client/client-details-dialog/client-details-dialog.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from './material/material.module';
import { PolicyDetailsDialogComponent } from './components/policy/policy-details-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PolicyComponent,
    PolicyFormDialogComponent,
    ClientComponent,
    ClientFormDialogComponent,
    ClientDetailsDialogComponent,
    EnrollmentComponent,
    DashboardComponent,
    PolicyDetailsDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

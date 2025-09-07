import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { ServicesComponent } from './app/pages/services/services.component';
import { BookingComponent } from './app/pages/booking/booking.component';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { AdminComponent } from './app/pages/admin/admin.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  imports: []
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'booking', component: BookingComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'login', redirectTo: '/dashboard' },
      { path: 'register', redirectTo: '/dashboard' },
      { path: '**', redirectTo: '' }
    ])
  ]
});
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { Booking, User } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <main class="dashboard">
      <div class="container">
        <!-- Success Message -->
        <div *ngIf="showSuccessMessage" class="success-banner">
          <div class="success-content">
            <div class="success-icon">🎉</div>
            <div class="success-text">
              <h3>Booking Confirmed!</h3>
              <p>Your service request has been submitted successfully. We'll contact you shortly to confirm the appointment.</p>
            </div>
            <button (click)="dismissSuccess()" class="dismiss-btn">×</button>
          </div>
        </div>
        
        <!-- Dashboard Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <h1 class="dashboard-title">
              Welcome back, {{ currentUser?.name }}!
            </h1>
            <p class="dashboard-subtitle">
              Manage your service bookings and track their progress
            </p>
          </div>
          <button (click)="navigateToServices()" class="btn btn-primary">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Book New Service
          </button>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <div class="stat-number">{{ totalBookings }}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-number">{{ pendingBookings }}</div>
              <div class="stat-label">Pending</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-number">{{ completedBookings }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-number">\${{ totalSpent }}</div>
              <div class="stat-label">Total Spent</div>
            </div>
          </div>
        </div>
        
        <!-- Bookings Section -->
        <div class="bookings-section">
          <div class="section-header">
            <h2 class="section-title">Your Bookings</h2>
            <div class="filter-tabs">
              <button 
                *ngFor="let tab of filterTabs" 
                class="filter-tab"
                [class.filter-tab-active]="selectedFilter === tab.value"
                (click)="setFilter(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <!-- Bookings List -->
          <div class="bookings-list" *ngIf="filteredBookings.length > 0">
            <div *ngFor="let booking of filteredBookings" class="booking-card">
              <div class="booking-header">
                <div class="booking-service">
                  <h3 class="service-name">{{ booking.service?.title || 'Service' }}</h3>
                  <div class="service-category">{{ booking.service?.category.name || 'General' }}</div>
                </div>
                <div class="booking-status">
                  <span class="status-badge" [ngClass]="'status-' + booking.status">
                    {{ getStatusLabel(booking.status) }}
                  </span>
                </div>
              </div>
              
              <div class="booking-details">
                <div class="detail-group">
                  <div class="detail-item">
                    <span class="detail-icon">📅</span>
                    <span class="detail-text">{{ booking.date | date:'fullDate' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">🕒</span>
                    <span class="detail-text">{{ booking.timeSlot }}</span>
                  </div>
                </div>
                
                <div class="detail-group">
                  <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-text">{{ booking.address }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">💰</span>
                    <span class="detail-text">\${{ booking.totalAmount }}</span>
                  </div>
                </div>
              </div>
              
              <div class="booking-actions" *ngIf="booking.status === 'pending'">
                <button class="btn btn-outline btn-sm">
                  Reschedule
                </button>
                <button class="btn btn-outline btn-sm" style="color: var(--error-500); border-color: var(--error-500);">
                  Cancel
                </button>
              </div>
              
              <div class="booking-actions" *ngIf="booking.status === 'completed'">
                <button class="btn btn-outline btn-sm">
                  Leave Review
                </button>
                <button class="btn btn-primary btn-sm">
                  Book Again
                </button>
              </div>
            </div>
          </div>
          
          <!-- No Bookings -->
          <div *ngIf="filteredBookings.length === 0" class="no-bookings">
            <div class="no-bookings-icon">📅</div>
            <h3 class="no-bookings-title">No {{ selectedFilter }} bookings found</h3>
            <p class="no-bookings-message">
              <span *ngIf="selectedFilter === 'all'">You haven't made any bookings yet.</span>
              <span *ngIf="selectedFilter !== 'all'">No bookings with {{ selectedFilter }} status.</span>
              Ready to book your first service?
            </p>
            <button (click)="navigateToServices()" class="btn btn-primary">
              Browse Services
            </button>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .dashboard {
      padding: var(--space-8) 0 var(--space-20);
      background: var(--neutral-50);
      min-height: calc(100vh - 80px);
    }
    
    .success-banner {
      background: linear-gradient(135deg, var(--secondary-500), var(--secondary-600));
      color: white;
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
      position: relative;
    }
    
    .success-content {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
    }
    
    .success-icon {
      font-size: var(--text-2xl);
      flex-shrink: 0;
    }
    
    .success-text h3 {
      font-size: var(--text-xl);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }
    
    .success-text p {
      opacity: 0.9;
      line-height: 1.5;
    }
    
    .dismiss-btn {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      background: none;
      border: none;
      color: white;
      font-size: var(--text-xl);
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s ease-in-out;
    }
    
    .dismiss-btn:hover {
      opacity: 1;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-12);
    }
    
    .header-content h1 {
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-2);
    }
    
    .dashboard-subtitle {
      color: var(--neutral-600);
      font-size: var(--text-lg);
    }
    
    .btn-icon {
      width: 16px;
      height: 16px;
      margin-right: var(--space-2);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-12);
    }
    
    .stat-card {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    
    .stat-icon {
      font-size: var(--text-3xl);
      flex-shrink: 0;
    }
    
    .stat-number {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-1);
    }
    
    .stat-label {
      color: var(--neutral-600);
      font-size: var(--text-sm);
    }
    
    .bookings-section {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-6);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .section-title {
      font-size: var(--text-2xl);
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .filter-tabs {
      display: flex;
      gap: var(--space-1);
    }
    
    .filter-tab {
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--neutral-300);
      background: white;
      color: var(--neutral-600);
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      font-size: var(--text-sm);
      font-weight: 500;
    }
    
    .filter-tab:first-child {
      border-radius: var(--border-radius) 0 0 var(--border-radius);
    }
    
    .filter-tab:last-child {
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
    }
    
    .filter-tab-active {
      background: var(--primary-600);
      color: white;
      border-color: var(--primary-600);
    }
    
    .bookings-list {
      padding: var(--space-6);
    }
    
    .booking-card {
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      margin-bottom: var(--space-4);
      transition: all 0.2s ease-in-out;
    }
    
    .booking-card:hover {
      border-color: var(--primary-300);
      box-shadow: var(--shadow);
    }
    
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }
    
    .service-name {
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-2);
    }
    
    .service-category {
      display: inline-block;
      background: var(--primary-100);
      color: var(--primary-600);
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
      font-size: var(--text-xs);
      font-weight: 500;
    }
    
    .status-badge {
      padding: var(--space-2) var(--space-4);
      border-radius: 9999px;
      font-size: var(--text-sm);
      font-weight: 500;
    }
    
    .status-pending {
      background: var(--accent-100);
      color: var(--accent-600);
    }
    
    .status-confirmed {
      background: var(--primary-100);
      color: var(--primary-600);
    }
    
    .status-in-progress {
      background: var(--secondary-100);
      color: var(--secondary-600);
    }
    
    .status-completed {
      background: var(--secondary-100);
      color: var(--secondary-600);
    }
    
    .status-cancelled {
      background: #fef2f2;
      color: var(--error-500);
    }
    
    .booking-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }
    
    .detail-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .detail-icon {
      font-size: var(--text-base);
    }
    
    .detail-text {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .booking-actions {
      display: flex;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    .no-bookings {
      text-align: center;
      padding: var(--space-20) var(--space-6);
    }
    
    .no-bookings-icon {
      font-size: 4rem;
      margin-bottom: var(--space-6);
      opacity: 0.5;
    }
    
    .no-bookings-title {
      font-size: var(--text-2xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
    }
    
    .no-bookings-message {
      color: var(--neutral-600);
      margin-bottom: var(--space-8);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
      }
      
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .section-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
      }
      
      .booking-details {
        grid-template-columns: 1fr;
      }
      
      .booking-actions {
        justify-content: center;
      }
      
      .success-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedFilter = 'all';
  showSuccessMessage = false;

  filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

  // Stats
  totalBookings = 0;
  pendingBookings = 0;
  completedBookings = 0;
  totalSpent = 0;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get current user
    this.dataService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserBookings();
      }
    });

    // Check for success message
    this.route.queryParams.subscribe(params => {
      if (params['bookingSuccess']) {
        this.showSuccessMessage = true;
      }
    });
  }

  loadUserBookings(): void {
    this.dataService.getBookings().subscribe(bookings => {
      // In real app, filter by current user ID
      this.allBookings = bookings;
      
      // Add service details to bookings
      this.allBookings.forEach(booking => {
        booking.service = this.dataService.getServiceById(booking.serviceId);
      });
      
      this.calculateStats();
      this.filterBookings();
    });
  }

  calculateStats(): void {
    this.totalBookings = this.allBookings.length;
    this.pendingBookings = this.allBookings.filter(b => b.status === 'pending').length;
    this.completedBookings = this.allBookings.filter(b => b.status === 'completed').length;
    this.totalSpent = this.allBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.filterBookings();
  }

  filterBookings(): void {
    if (this.selectedFilter === 'all') {
      this.filteredBookings = [...this.allBookings];
    } else {
      this.filteredBookings = this.allBookings.filter(booking => 
        booking.status === this.selectedFilter
      );
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  }

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  dismissSuccess(): void {
    this.showSuccessMessage = false;
  }
}
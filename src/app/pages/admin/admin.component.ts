import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { Booking, AdminStats, Service } from '../../models/interfaces';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <main class="admin-panel">
      <div class="container">
        <!-- Admin Header -->
        <div class="admin-header">
          <h1 class="admin-title">Admin Dashboard</h1>
          <p class="admin-subtitle">Manage bookings, services, and monitor business performance</p>
        </div>
        
        <!-- Navigation Tabs -->
        <div class="admin-tabs">
          <button 
            *ngFor="let tab of tabs" 
            class="tab-btn"
            [class.tab-active]="activeTab === tab.id"
            (click)="setActiveTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <!-- Dashboard Overview Tab -->
        <div *ngIf="activeTab === 'overview'" class="tab-content">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon">📅</div>
                <h3 class="stat-title">Total Bookings</h3>
              </div>
              <div class="stat-number">{{ adminStats.totalBookings }}</div>
              <div class="stat-change positive">+12% from last month</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon">⏳</div>
                <h3 class="stat-title">Pending Requests</h3>
              </div>
              <div class="stat-number">{{ adminStats.pendingBookings }}</div>
              <div class="stat-change">Needs attention</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon">✅</div>
                <h3 class="stat-title">Completed</h3>
              </div>
              <div class="stat-number">{{ adminStats.completedBookings }}</div>
              <div class="stat-change positive">+8% completion rate</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-icon">💰</div>
                <h3 class="stat-title">Monthly Revenue</h3>
              </div>
              <div class="stat-number">\${{ adminStats.monthlyRevenue.toLocaleString() }}</div>
              <div class="stat-change positive">+15% this month</div>
            </div>
          </div>
          
          <!-- Popular Services -->
          <div class="popular-services">
            <h2 class="section-title">Popular Services</h2>
            <div class="services-chart">
              <div *ngFor="let item of adminStats.popularServices" class="service-item">
                <div class="service-info">
                  <div class="service-name">{{ item.service.title }}</div>
                  <div class="service-category">{{ item.service.category.name }}</div>
                </div>
                <div class="service-stats">
                  <div class="booking-count">{{ item.bookingCount }} bookings</div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="(item.bookingCount / getMaxBookings()) * 100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bookings Management Tab -->
        <div *ngIf="activeTab === 'bookings'" class="tab-content">
          <div class="bookings-header">
            <h2 class="section-title">All Bookings</h2>
            <div class="booking-filters">
              <select [(ngModel)]="bookingFilter" (change)="filterBookings()" class="filter-select">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="filterBookings()"
                placeholder="Search customer or service..." 
                class="search-input"
              />
            </div>
          </div>
          
          <div class="bookings-table">
            <div class="table-header">
              <div class="table-col">Customer</div>
              <div class="table-col">Service</div>
              <div class="table-col">Date & Time</div>
              <div class="table-col">Status</div>
              <div class="table-col">Amount</div>
              <div class="table-col">Actions</div>
            </div>
            
            <div *ngFor="let booking of filteredAdminBookings" class="table-row">
              <div class="table-col">
                <div class="customer-info">
                  <div class="customer-name">{{ booking.customerName }}</div>
                  <div class="customer-email">{{ booking.customerEmail }}</div>
                </div>
              </div>
              
              <div class="table-col">
                <div class="service-info">
                  <div class="service-name">{{ booking.service?.title || 'Service' }}</div>
                  <div class="service-category">{{ booking.service?.category?.name || 'General' }}</div>
                </div>
              </div>
              
              <div class="table-col">
                <div class="date-time">
                  <div class="date">{{ booking.date | date:'MMM d, y' }}</div>
                  <div class="time">{{ booking.timeSlot }}</div>
                </div>
              </div>
              
              <div class="table-col">
                <span class="status-badge" [ngClass]="'status-' + booking.status">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </div>
              
              <div class="table-col">
                <div class="amount">\${{ booking.totalAmount }}</div>
              </div>
              
              <div class="table-col">
                <div class="action-buttons">
                  <button 
                    *ngIf="booking.status === 'pending'"
                    (click)="updateBookingStatus(booking.id, 'confirmed')"
                    class="btn-action btn-confirm"
                  >
                    Confirm
                  </button>
                  <button 
                    *ngIf="booking.status === 'confirmed'"
                    (click)="updateBookingStatus(booking.id, 'in-progress')"
                    class="btn-action btn-start"
                  >
                    Start
                  </button>
                  <button 
                    *ngIf="booking.status === 'in-progress'"
                    (click)="updateBookingStatus(booking.id, 'completed')"
                    class="btn-action btn-complete"
                  >
                    Complete
                  </button>
                  <button 
                    *ngIf="booking.status !== 'completed' && booking.status !== 'cancelled'"
                    (click)="updateBookingStatus(booking.id, 'cancelled')"
                    class="btn-action btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="filteredAdminBookings.length === 0" class="no-results">
            <div class="no-results-icon">📋</div>
            <h3>No bookings found</h3>
            <p>No bookings match your current filters.</p>
          </div>
        </div>
        
        <!-- Services Management Tab -->
        <div *ngIf="activeTab === 'services'" class="tab-content">
          <div class="services-header">
            <h2 class="section-title">Service Management</h2>
            <button class="btn btn-primary">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Service
            </button>
          </div>
          
          <div class="services-grid">
            <div *ngFor="let service of services" class="service-admin-card">
              <div class="service-image">
                <img [src]="service.image" [alt]="service.title">
                <div class="service-status">
                  <span class="status-indicator" [class.active]="service.isActive"></span>
                  <span class="status-text">{{ service.isActive ? 'Active' : 'Inactive' }}</span>
                </div>
              </div>
              
              <div class="service-content">
                <div class="service-header">
                  <h3 class="service-title">{{ service.title }}</h3>
                  <div class="service-price">\${{ service.price }}</div>
                </div>
                
                <p class="service-description">{{ service.description }}</p>
                
                <div class="service-stats">
                  <div class="stat">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">{{ service.rating }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">👥</span>
                    <span class="stat-value">{{ service.reviewCount }} reviews</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">⏱️</span>
                    <span class="stat-value">{{ service.duration }}min</span>
                  </div>
                </div>
                
                <div class="service-actions">
                  <button class="btn-action btn-edit">Edit</button>
                  <button 
                    class="btn-action"
                    [class.btn-deactivate]="service.isActive"
                    [class.btn-activate]="!service.isActive"
                  >
                    {{ service.isActive ? 'Deactivate' : 'Activate' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Analytics Tab -->
        <div *ngIf="activeTab === 'analytics'" class="tab-content">
          <div class="analytics-header">
            <h2 class="section-title">Business Analytics</h2>
            <div class="date-range-picker">
              <select class="filter-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
          
          <div class="analytics-content">
            <div class="revenue-card">
              <h3 class="card-title">Revenue Overview</h3>
              <div class="revenue-stats">
                <div class="revenue-item">
                  <div class="revenue-label">Total Revenue</div>
                  <div class="revenue-value">\${{ adminStats.totalRevenue.toLocaleString() }}</div>
                </div>
                <div class="revenue-item">
                  <div class="revenue-label">This Month</div>
                  <div class="revenue-value">\${{ adminStats.monthlyRevenue.toLocaleString() }}</div>
                </div>
                <div class="revenue-item">
                  <div class="revenue-label">Average per Booking</div>
                  <div class="revenue-value">\${{ getAverageBookingValue() }}</div>
                </div>
              </div>
            </div>
            
            <div class="performance-metrics">
              <h3 class="card-title">Key Metrics</h3>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-value">95%</div>
                  <div class="metric-label">Customer Satisfaction</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">2.5hrs</div>
                  <div class="metric-label">Avg. Response Time</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">85%</div>
                  <div class="metric-label">Completion Rate</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">4.8★</div>
                  <div class="metric-label">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .admin-panel {
      padding: var(--space-8) 0 var(--space-20);
      background: var(--neutral-50);
      min-height: calc(100vh - 80px);
    }
    
    .admin-header {
      margin-bottom: var(--space-8);
    }
    
    .admin-title {
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-2);
    }
    
    .admin-subtitle {
      color: var(--neutral-600);
      font-size: var(--text-lg);
    }
    
    .admin-tabs {
      display: flex;
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      margin-bottom: var(--space-8);
      overflow: hidden;
    }
    
    .tab-btn {
      flex: 1;
      padding: var(--space-4) var(--space-6);
      background: white;
      border: none;
      color: var(--neutral-600);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    
    .tab-btn:hover {
      background: var(--neutral-50);
    }
    
    .tab-active {
      background: var(--primary-600);
      color: white;
    }
    
    .tab-content {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-12);
    }
    
    .stat-card {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow);
    }
    
    .stat-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .stat-icon {
      font-size: var(--text-xl);
    }
    
    .stat-title {
      font-size: var(--text-base);
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .stat-number {
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-2);
    }
    
    .stat-change {
      font-size: var(--text-sm);
      color: var(--neutral-500);
    }
    
    .stat-change.positive {
      color: var(--secondary-600);
    }
    
    .popular-services {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow);
    }
    
    .section-title {
      font-size: var(--text-2xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-6);
    }
    
    .services-chart {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .service-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius);
    }
    
    .service-name {
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-1);
    }
    
    .service-category {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .service-stats {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-2);
      min-width: 150px;
    }
    
    .booking-count {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .progress-bar {
      width: 100px;
      height: 4px;
      background: var(--neutral-200);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: var(--primary-600);
      border-radius: 2px;
    }
    
    .bookings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .booking-filters {
      display: flex;
      gap: var(--space-4);
    }
    
    .filter-select,
    .search-input {
      padding: var(--space-2) var(--space-4);
      border: 1px solid var(--neutral-300);
      border-radius: var(--border-radius);
      font-size: var(--text-sm);
    }
    
    .search-input {
      min-width: 250px;
    }
    
    .bookings-table {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .table-header {
      display: grid;
      grid-template-columns: 1.5fr 1.5fr 1fr 0.8fr 0.8fr 1.2fr;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-6);
      background: var(--neutral-100);
      font-weight: 600;
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 1.5fr 1.5fr 1fr 0.8fr 0.8fr 1.2fr;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--neutral-200);
      align-items: center;
    }
    
    .customer-info,
    .service-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .customer-name,
    .service-name {
      font-weight: 500;
      color: var(--neutral-900);
    }
    
    .customer-email,
    .service-category {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .date-time {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .date {
      font-weight: 500;
      color: var(--neutral-900);
    }
    
    .time {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .status-badge {
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
      font-size: var(--text-xs);
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
    
    .amount {
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .action-buttons {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    
    .btn-action {
      padding: var(--space-1) var(--space-3);
      border: none;
      border-radius: var(--border-radius);
      font-size: var(--text-xs);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    
    .btn-confirm {
      background: var(--primary-600);
      color: white;
    }
    
    .btn-start {
      background: var(--secondary-600);
      color: white;
    }
    
    .btn-complete {
      background: var(--secondary-600);
      color: white;
    }
    
    .btn-cancel {
      background: var(--error-500);
      color: white;
    }
    
    .btn-action:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
    
    .services-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .btn-icon {
      width: 16px;
      height: 16px;
      margin-right: var(--space-2);
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-6);
    }
    
    .service-admin-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .service-image {
      position: relative;
      height: 200px;
    }
    
    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .service-status {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius);
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--error-500);
    }
    
    .status-indicator.active {
      background: var(--secondary-500);
    }
    
    .status-text {
      font-size: var(--text-xs);
      font-weight: 500;
    }
    
    .service-content {
      padding: var(--space-6);
    }
    
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-3);
    }
    
    .service-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .service-price {
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--primary-600);
    }
    
    .service-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-4);
      line-height: 1.5;
    }
    
    .service-stats {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    
    .stat {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }
    
    .stat-icon {
      font-size: var(--text-sm);
    }
    
    .stat-value {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .service-actions {
      display: flex;
      gap: var(--space-3);
    }
    
    .btn-edit {
      background: var(--primary-100);
      color: var(--primary-600);
    }
    
    .btn-activate {
      background: var(--secondary-100);
      color: var(--secondary-600);
    }
    
    .btn-deactivate {
      background: var(--neutral-200);
      color: var(--neutral-600);
    }
    
    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }
    
    .analytics-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
    }
    
    .revenue-card,
    .performance-metrics {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      box-shadow: var(--shadow);
    }
    
    .card-title {
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-6);
    }
    
    .revenue-stats {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .revenue-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      background: var(--neutral-50);
      border-radius: var(--border-radius);
    }
    
    .revenue-label {
      color: var(--neutral-600);
    }
    
    .revenue-value {
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--neutral-900);
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }
    
    .metric-card {
      text-align: center;
      padding: var(--space-4);
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius);
    }
    
    .metric-value {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--primary-600);
      margin-bottom: var(--space-2);
    }
    
    .metric-label {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .no-results {
      text-align: center;
      padding: var(--space-16);
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
    }
    
    .no-results-icon {
      font-size: 3rem;
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }
    
    @media (max-width: 768px) {
      .admin-tabs {
        flex-direction: column;
      }
      
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .bookings-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
      }
      
      .booking-filters {
        justify-content: center;
      }
      
      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: var(--space-2);
      }
      
      .services-grid {
        grid-template-columns: 1fr;
      }
      
      .analytics-content {
        grid-template-columns: 1fr;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'overview';
  adminStats: AdminStats = {
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    popularServices: []
  };
  
  allBookings: Booking[] = [];
  filteredAdminBookings: Booking[] = [];
  services: Service[] = [];
  
  bookingFilter = '';
  searchTerm = '';

  tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'services', label: 'Services' },
    { id: 'analytics', label: 'Analytics' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    // Load admin stats
    this.adminStats = this.dataService.getAdminStats();
    
    // Load bookings
    this.dataService.getBookings().subscribe(bookings => {
      this.allBookings = bookings;
      // Add service details to bookings
      this.allBookings.forEach(booking => {
        booking.service = this.dataService.getServiceById(booking.serviceId);
      });
      this.filterBookings();
    });
    
    // Load services
    this.dataService.getServices().subscribe(services => {
      this.services = services;
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  filterBookings(): void {
    let filtered = [...this.allBookings];
    
    // Filter by status
    if (this.bookingFilter) {
      filtered = filtered.filter(booking => booking.status === this.bookingFilter);
    }
    
    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(term) ||
        booking.customerEmail.toLowerCase().includes(term) ||
        booking.service?.title.toLowerCase().includes(term) ||
        booking.service?.category.name.toLowerCase().includes(term)
      );
    }
    
    this.filteredAdminBookings = filtered;
  }

  updateBookingStatus(bookingId: string, newStatus: Booking['status']): void {
    this.dataService.updateBookingStatus(bookingId, newStatus);
    // Reload data to reflect changes
    this.loadAdminData();
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

  getMaxBookings(): number {
    if (this.adminStats.popularServices.length === 0) return 1;
    return Math.max(...this.adminStats.popularServices.map(item => item.bookingCount));
  }

  getAverageBookingValue(): string {
    if (this.adminStats.totalBookings === 0) return '0';
    return (this.adminStats.totalRevenue / this.adminStats.totalBookings).toFixed(0);
  }
}
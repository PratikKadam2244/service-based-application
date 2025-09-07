import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { Service, Booking, BookingFormData, TimeSlot } from '../../models/interfaces';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <main class="booking-page">
      <div class="container">
        <div class="booking-container" *ngIf="selectedService">
          <!-- Left Column - Service Info -->
          <div class="service-info">
            <div class="service-card">
              <div class="service-image">
                <img [src]="selectedService.image" [alt]="selectedService.title">
              </div>
              <div class="service-details">
                <div class="service-category">{{ selectedService.category.name }}</div>
                <h2 class="service-title">{{ selectedService.title }}</h2>
                <p class="service-description">{{ selectedService.description }}</p>
                
                <div class="service-features">
                  <h4>What's included:</h4>
                  <ul>
                    <li *ngFor="let feature of selectedService.features">
                      <span class="feature-icon">✓</span>
                      {{ feature }}
                    </li>
                  </ul>
                </div>
                
                <div class="service-pricing">
                  <div class="price-info">
                    <span class="price-label">Service Price:</span>
                    <span class="price-value">\${{ selectedService.price }}</span>
                  </div>
                  <div class="duration-info">
                    <span class="duration-label">Duration:</span>
                    <span class="duration-value">{{ selectedService.duration }} minutes</span>
                  </div>
                </div>
                
                <div class="service-rating">
                  <div class="rating-display">
                    <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-text">{{ selectedService.rating }} ({{ selectedService.reviewCount }} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Booking Form -->
          <div class="booking-form-section">
            <div class="form-card">
              <div class="form-header">
                <h3 class="form-title">Book Your Service</h3>
                <p class="form-subtitle">Fill in the details to schedule your appointment</p>
              </div>
              
              <form (ngSubmit)="submitBooking()" #bookingForm="ngForm" class="booking-form">
                <!-- Step 1: Date & Time -->
                <div class="form-step" [class.form-step-active]="currentStep >= 1">
                  <div class="step-header">
                    <div class="step-number">1</div>
                    <h4 class="step-title">Select Date & Time</h4>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Preferred Date</label>
                    <input 
                      type="date" 
                      [(ngModel)]="formData.date" 
                      name="date"
                      [min]="minDate"
                      (change)="onDateChange()"
                      class="input"
                      required
                    />
                  </div>
                  
                  <div class="form-group" *ngIf="formData.date">
                    <label class="form-label">Available Time Slots</label>
                    <div class="time-slots">
                      <button 
                        type="button"
                        *ngFor="let slot of availableSlots" 
                        class="time-slot"
                        [class.time-slot-selected]="formData.timeSlot === slot.time"
                        [class.time-slot-unavailable]="!slot.available"
                        [disabled]="!slot.available"
                        (click)="selectTimeSlot(slot.time)"
                      >
                        {{ slot.time }}
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Step 2: Customer Info -->
                <div class="form-step" [class.form-step-active]="currentStep >= 2">
                  <div class="step-header">
                    <div class="step-number">2</div>
                    <h4 class="step-title">Contact Information</h4>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Full Name</label>
                      <input 
                        type="text" 
                        [(ngModel)]="formData.customerName" 
                        name="customerName"
                        placeholder="Enter your full name"
                        class="input"
                        required
                      />
                    </div>
                    
                    <div class="form-group">
                      <label class="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        [(ngModel)]="formData.customerPhone" 
                        name="customerPhone"
                        placeholder="(555) 123-4567"
                        class="input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input 
                      type="email" 
                      [(ngModel)]="formData.customerEmail" 
                      name="customerEmail"
                      placeholder="your@email.com"
                      class="input"
                      required
                    />
                  </div>
                </div>
                
                <!-- Step 3: Service Location -->
                <div class="form-step" [class.form-step-active]="currentStep >= 3">
                  <div class="step-header">
                    <div class="step-number">3</div>
                    <h4 class="step-title">Service Location</h4>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Service Address</label>
                    <textarea 
                      [(ngModel)]="formData.address" 
                      name="address"
                      placeholder="Enter your complete address including apartment/unit number"
                      class="input textarea"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Additional Notes (Optional)</label>
                    <textarea 
                      [(ngModel)]="formData.notes" 
                      name="notes"
                      placeholder="Any specific instructions or requirements for the service..."
                      class="input textarea"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <!-- Booking Summary -->
                <div class="booking-summary" *ngIf="isFormValid()">
                  <h4 class="summary-title">Booking Summary</h4>
                  <div class="summary-item">
                    <span>Service:</span>
                    <span>{{ selectedService.title }}</span>
                  </div>
                  <div class="summary-item">
                    <span>Date & Time:</span>
                    <span>{{ formData.date | date:'fullDate' }} at {{ formData.timeSlot }}</span>
                  </div>
                  <div class="summary-item">
                    <span>Duration:</span>
                    <span>{{ selectedService.duration }} minutes</span>
                  </div>
                  <div class="summary-item total">
                    <span>Total Amount:</span>
                    <span>\${{ selectedService.price }}</span>
                  </div>
                </div>
                
                <!-- Form Actions -->
                <div class="form-actions">
                  <button 
                    type="button" 
                    (click)="goBack()" 
                    class="btn btn-outline"
                  >
                    Back to Services
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="!isFormValid() || isSubmitting"
                  >
                    <span *ngIf="!isSubmitting">Confirm Booking</span>
                    <span *ngIf="isSubmitting">Processing...</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div *ngIf="!selectedService" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading service details...</p>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .booking-page {
      padding: var(--space-8) 0 var(--space-20);
      background: var(--neutral-50);
      min-height: calc(100vh - 80px);
    }
    
    .booking-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .service-info {
      position: sticky;
      top: var(--space-8);
      height: fit-content;
    }
    
    .service-card {
      background: white;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    
    .service-image {
      height: 250px;
      overflow: hidden;
    }
    
    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .service-details {
      padding: var(--space-6);
    }
    
    .service-category {
      display: inline-block;
      background: var(--primary-100);
      color: var(--primary-600);
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
      font-size: var(--text-xs);
      font-weight: 500;
      margin-bottom: var(--space-3);
    }
    
    .service-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
    }
    
    .service-description {
      color: var(--neutral-600);
      line-height: 1.6;
      margin-bottom: var(--space-6);
    }
    
    .service-features h4 {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
    }
    
    .service-features ul {
      list-style: none;
      margin-bottom: var(--space-6);
    }
    
    .service-features li {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
      color: var(--neutral-700);
    }
    
    .feature-icon {
      color: var(--secondary-500);
      font-weight: 600;
    }
    
    .service-pricing {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--neutral-50);
      border-radius: var(--border-radius);
      margin-bottom: var(--space-6);
    }
    
    .price-info,
    .duration-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .price-label,
    .duration-label {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .price-value {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--primary-600);
    }
    
    .duration-value {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .service-rating {
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    .rating-display {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .rating-stars {
      font-size: var(--text-lg);
      color: var(--accent-500);
    }
    
    .rating-text {
      color: var(--neutral-600);
      font-size: var(--text-sm);
    }
    
    .form-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .form-header {
      background: var(--primary-600);
      color: white;
      padding: var(--space-6);
      text-align: center;
    }
    
    .form-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      margin-bottom: var(--space-2);
    }
    
    .form-subtitle {
      opacity: 0.9;
    }
    
    .booking-form {
      padding: var(--space-6);
    }
    
    .form-step {
      margin-bottom: var(--space-8);
      opacity: 0.5;
      transition: opacity 0.3s ease-in-out;
    }
    
    .form-step-active {
      opacity: 1;
    }
    
    .step-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }
    
    .step-number {
      width: 32px;
      height: 32px;
      background: var(--primary-600);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: var(--text-sm);
    }
    
    .step-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .form-group {
      margin-bottom: var(--space-4);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }
    
    .form-label {
      display: block;
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
    }
    
    .textarea {
      resize: vertical;
      min-height: 80px;
    }
    
    .time-slots {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--space-3);
    }
    
    .time-slot {
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--neutral-300);
      border-radius: var(--border-radius);
      background: white;
      color: var(--neutral-700);
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      text-align: center;
      font-size: var(--text-sm);
      font-weight: 500;
    }
    
    .time-slot:hover:not(.time-slot-unavailable) {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }
    
    .time-slot-selected {
      background: var(--primary-600);
      color: white;
      border-color: var(--primary-600);
    }
    
    .time-slot-unavailable {
      background: var(--neutral-100);
      color: var(--neutral-400);
      cursor: not-allowed;
      opacity: 0.5;
    }
    
    .booking-summary {
      background: var(--neutral-50);
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius);
      padding: var(--space-6);
      margin-bottom: var(--space-6);
    }
    
    .summary-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2) 0;
      color: var(--neutral-700);
    }
    
    .summary-item:not(:last-child) {
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .summary-item.total {
      font-weight: 600;
      font-size: var(--text-lg);
      color: var(--neutral-900);
      margin-top: var(--space-3);
      padding-top: var(--space-3);
      border-top: 2px solid var(--primary-200);
    }
    
    .form-actions {
      display: flex;
      gap: var(--space-4);
      justify-content: space-between;
    }
    
    .loading-state {
      text-align: center;
      padding: var(--space-20);
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--neutral-200);
      border-top: 3px solid var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--space-4);
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .booking-container {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
      
      .service-info {
        position: static;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .time-slots {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .service-pricing {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingComponent implements OnInit {
  selectedService: Service | undefined;
  currentStep = 3; // Show all steps by default
  availableSlots: TimeSlot[] = [];
  minDate: string = '';
  isSubmitting = false;

  formData: BookingFormData = {
    serviceId: '',
    date: '',
    timeSlot: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    notes: ''
  };

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const serviceId = params['serviceId'];
      if (serviceId) {
        this.selectedService = this.dataService.getServiceById(serviceId);
        if (this.selectedService) {
          this.formData.serviceId = serviceId;
        }
      }
    });
  }

  onDateChange(): void {
    if (this.formData.date) {
      this.availableSlots = this.dataService.getAvailableTimeSlots(this.formData.date);
      this.formData.timeSlot = ''; // Reset selected time slot
    }
  }

  selectTimeSlot(time: string): void {
    this.formData.timeSlot = time;
  }

  isFormValid(): boolean {
    return !!(
      this.formData.serviceId &&
      this.formData.date &&
      this.formData.timeSlot &&
      this.formData.customerName &&
      this.formData.customerPhone &&
      this.formData.customerEmail &&
      this.formData.address
    );
  }

  submitBooking(): void {
    if (!this.isFormValid() || !this.selectedService) {
      return;
    }

    this.isSubmitting = true;

    // Simulate booking submission
    setTimeout(() => {
      const newBooking: Booking = {
        id: 'booking-' + Date.now(),
        userId: 'user-1', // In real app, get from auth
        serviceId: this.formData.serviceId,
        date: new Date(this.formData.date),
        timeSlot: this.formData.timeSlot,
        status: 'pending',
        customerName: this.formData.customerName,
        customerPhone: this.formData.customerPhone,
        customerEmail: this.formData.customerEmail,
        address: this.formData.address,
        notes: this.formData.notes,
        totalAmount: this.selectedService!.price,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: this.selectedService
      };

      this.dataService.addBooking(newBooking);
      
      // Navigate to success page or dashboard
      this.router.navigate(['/dashboard'], { 
        queryParams: { bookingSuccess: true, bookingId: newBooking.id } 
      });
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/services']);
  }
}
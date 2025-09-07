import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Professional Home Services
              <span class="title-highlight">At Your Doorstep</span>
            </h1>
            <p class="hero-description">
              Book trusted professionals for AC repair, plumbing, cleaning, electrical work, and more. 
              Quality service guaranteed with transparent pricing and expert technicians.
            </p>
            
            <div class="hero-features">
              <div class="feature">
                <span class="feature-icon">✅</span>
                <span>Verified Professionals</span>
              </div>
              <div class="feature">
                <span class="feature-icon">⚡</span>
                <span>Same-Day Service</span>
              </div>
              <div class="feature">
                <span class="feature-icon">💰</span>
                <span>Transparent Pricing</span>
              </div>
            </div>
            
            <div class="hero-actions">
              <button (click)="navigateToServices()" class="btn btn-primary btn-large">
                Book Service Now
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <button (click)="scrollToServices()" class="btn btn-outline btn-large">
                View Services
              </button>
            </div>
          </div>
          
          <div class="hero-image">
            <img src="https://images.pexels.com/photos/4792284/pexels-photo-4792284.jpeg?auto=compress&cs=tinysrgb&w=600" 
                 alt="Professional service technician" 
                 class="hero-img">
            <div class="image-overlay">
              <div class="stats-card">
                <div class="stat">
                  <div class="stat-number">500+</div>
                  <div class="stat-label">Happy Customers</div>
                </div>
                <div class="stat">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--neutral-50) 100%);
      padding: var(--space-20) 0 var(--space-16);
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 100%);
      pointer-events: none;
    }
    
    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-16);
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .hero-title {
      font-size: var(--text-4xl);
      font-weight: 700;
      line-height: 1.2;
      color: var(--neutral-900);
      margin-bottom: var(--space-6);
    }
    
    .title-highlight {
      color: var(--primary-600);
      display: block;
      margin-top: var(--space-2);
    }
    
    .hero-description {
      font-size: var(--text-lg);
      color: var(--neutral-600);
      line-height: 1.6;
      margin-bottom: var(--space-8);
      max-width: 500px;
    }
    
    .hero-features {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-8);
    }
    
    .feature {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .feature-icon {
      font-size: var(--text-lg);
    }
    
    .hero-actions {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }
    
    .btn-large {
      padding: var(--space-4) var(--space-8);
      font-size: var(--text-base);
      font-weight: 600;
    }
    
    .btn-icon {
      width: 20px;
      height: 20px;
      margin-left: var(--space-2);
    }
    
    .hero-image {
      position: relative;
    }
    
    .hero-img {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
    }
    
    .image-overlay {
      position: absolute;
      bottom: -20px;
      left: -20px;
    }
    
    .stats-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      padding: var(--space-6);
      display: flex;
      gap: var(--space-8);
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-number {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--primary-600);
      line-height: 1.2;
    }
    
    .stat-label {
      font-size: var(--text-sm);
      color: var(--neutral-600);
      margin-top: var(--space-1);
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: var(--space-16) 0 var(--space-12);
      }
      
      .hero-content {
        grid-template-columns: 1fr;
        gap: var(--space-12);
      }
      
      .hero-title {
        font-size: var(--text-3xl);
      }
      
      .hero-actions {
        justify-content: center;
      }
      
      .btn-large {
        padding: var(--space-3) var(--space-6);
        font-size: var(--text-sm);
      }
      
      .hero-img {
        height: 300px;
      }
      
      .image-overlay {
        position: static;
        margin-top: var(--space-4);
        display: flex;
        justify-content: center;
      }
      
      .stats-card {
        justify-content: center;
      }
    }
  `]
})
export class HeroComponent {
  constructor(private router: Router) {}

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  scrollToServices(): void {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
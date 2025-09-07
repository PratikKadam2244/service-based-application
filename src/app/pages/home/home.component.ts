import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { DataService } from '../../services/data.service';
import { Service, ServiceCategory } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeroComponent],
  template: `
    <app-header></app-header>
    <main>
      <app-hero></app-hero>
      
      <!-- Service Categories Section -->
      <section class="categories-section" id="services">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Our Service Categories</h2>
            <p class="section-subtitle">
              Professional services for every need. Choose from our wide range of expert solutions.
            </p>
          </div>
          
          <div class="categories-grid">
            <div *ngFor="let category of categories" 
                 class="category-card"
                 (click)="navigateToCategory(category.id)">
              <div class="category-icon">{{ category.icon }}</div>
              <h3 class="category-title">{{ category.name }}</h3>
              <p class="category-description">{{ category.description }}</p>
              <div class="category-arrow">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Featured Services Section -->
      <section class="featured-services">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Popular Services</h2>
            <p class="section-subtitle">
              Our most requested services by satisfied customers
            </p>
          </div>
          
          <div class="services-grid">
            <div *ngFor="let service of featuredServices" 
                 class="service-card"
                 (click)="navigateToService(service.id)">
              <div class="service-image">
                <img [src]="service.image" [alt]="service.title">
                <div class="service-badge">
                  <span class="rating">⭐ {{ service.rating }}</span>
                  <span class="reviews">({{ service.reviewCount }})</span>
                </div>
              </div>
              
              <div class="service-content">
                <div class="service-category-badge">{{ service.category.name }}</div>
                <h3 class="service-title">{{ service.title }}</h3>
                <p class="service-description">{{ service.description }}</p>
                
                <div class="service-features">
                  <div *ngFor="let feature of service.features.slice(0, 2)" class="feature-item">
                    <span class="feature-icon">✓</span>
                    {{ feature }}
                  </div>
                </div>
                
                <div class="service-footer">
                  <div class="service-price">
                    <span class="price-label">Starting at</span>
                    <span class="price-value">\${{ service.price }}</span>
                  </div>
                  <button class="btn btn-primary btn-sm">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Why Choose Us Section -->
      <section class="why-choose-us">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Why Choose ServicePro?</h2>
            <p class="section-subtitle">
              We're committed to providing the best service experience
            </p>
          </div>
          
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">🛡️</div>
              <h3 class="benefit-title">Verified Professionals</h3>
              <p class="benefit-description">
                All our service providers are background-checked and verified for your safety and peace of mind.
              </p>
            </div>
            
            <div class="benefit-card">
              <div class="benefit-icon">⚡</div>
              <h3 class="benefit-title">Quick Response</h3>
              <p class="benefit-description">
                Same-day service available for urgent needs. We understand your time is valuable.
              </p>
            </div>
            
            <div class="benefit-card">
              <div class="benefit-icon">💰</div>
              <h3 class="benefit-title">Transparent Pricing</h3>
              <p class="benefit-description">
                No hidden fees or surprise charges. You'll know the exact cost before we start.
              </p>
            </div>
            
            <div class="benefit-card">
              <div class="benefit-icon">🎯</div>
              <h3 class="benefit-title">Quality Guarantee</h3>
              <p class="benefit-description">
                100% satisfaction guarantee on all services. Not happy? We'll make it right.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <span class="logo-icon">🔧</span>
              <span class="logo-text">ServicePro</span>
            </div>
            <p class="footer-description">
              Professional home services at your doorstep. Quality, reliability, and customer satisfaction guaranteed.
            </p>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Services</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">AC Repair</a></li>
              <li><a href="#" class="footer-link">Plumbing</a></li>
              <li><a href="#" class="footer-link">Cleaning</a></li>
              <li><a href="#" class="footer-link">Electrical</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Company</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">About Us</a></li>
              <li><a href="#" class="footer-link">Contact</a></li>
              <li><a href="#" class="footer-link">Careers</a></li>
              <li><a href="#" class="footer-link">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 class="footer-title">Support</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Help Center</a></li>
              <li><a href="#" class="footer-link">Book Service</a></li>
              <li><a href="#" class="footer-link">Track Order</a></li>
              <li><a href="#" class="footer-link">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copyright">
            © 2024 ServicePro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .categories-section {
      padding: var(--space-20) 0;
      background: white;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: var(--space-16);
    }
    
    .section-title {
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
    }
    
    .section-subtitle {
      font-size: var(--text-lg);
      color: var(--neutral-600);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .category-card {
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius-lg);
      padding: var(--space-8);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      position: relative;
    }
    
    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-300);
    }
    
    .category-icon {
      font-size: 3rem;
      margin-bottom: var(--space-4);
    }
    
    .category-title {
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
    }
    
    .category-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-4);
    }
    
    .category-arrow {
      color: var(--primary-600);
      width: 20px;
      height: 20px;
      margin: 0 auto;
    }
    
    .featured-services {
      padding: var(--space-20) 0;
      background: var(--neutral-50);
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-8);
    }
    
    .service-card {
      background: white;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      box-shadow: var(--shadow);
    }
    
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    
    .service-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease-in-out;
    }
    
    .service-card:hover .service-image img {
      transform: scale(1.05);
    }
    
    .service-badge {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-sm);
    }
    
    .rating {
      font-weight: 600;
      color: var(--accent-600);
    }
    
    .reviews {
      color: var(--neutral-600);
    }
    
    .service-content {
      padding: var(--space-6);
    }
    
    .service-category-badge {
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
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
    }
    
    .service-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-4);
      line-height: 1.5;
    }
    
    .service-features {
      margin-bottom: var(--space-6);
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--neutral-600);
      font-size: var(--text-sm);
      margin-bottom: var(--space-2);
    }
    
    .feature-icon {
      color: var(--secondary-500);
      font-weight: 600;
    }
    
    .service-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .service-price {
      display: flex;
      flex-direction: column;
    }
    
    .price-label {
      font-size: var(--text-xs);
      color: var(--neutral-500);
      margin-bottom: var(--space-1);
    }
    
    .price-value {
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--neutral-900);
    }
    
    .btn-sm {
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-sm);
    }
    
    .why-choose-us {
      padding: var(--space-20) 0;
      background: white;
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-8);
    }
    
    .benefit-card {
      text-align: center;
      padding: var(--space-6);
    }
    
    .benefit-icon {
      font-size: 3rem;
      margin-bottom: var(--space-4);
    }
    
    .benefit-title {
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
    }
    
    .benefit-description {
      color: var(--neutral-600);
      line-height: 1.6;
    }
    
    .footer {
      background: var(--neutral-900);
      color: var(--neutral-300);
      padding: var(--space-16) 0 var(--space-8);
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-12);
    }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }
    
    .footer-logo .logo-icon {
      font-size: var(--text-2xl);
    }
    
    .footer-logo .logo-text {
      font-size: var(--text-xl);
      font-weight: 700;
      color: white;
    }
    
    .footer-description {
      color: var(--neutral-400);
      line-height: 1.6;
    }
    
    .footer-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: white;
      margin-bottom: var(--space-4);
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-links li {
      margin-bottom: var(--space-2);
    }
    
    .footer-link {
      color: var(--neutral-400);
      text-decoration: none;
      transition: color 0.2s ease-in-out;
    }
    
    .footer-link:hover {
      color: white;
    }
    
    .footer-bottom {
      border-top: 1px solid var(--neutral-700);
      padding-top: var(--space-8);
      text-align: center;
    }
    
    .footer-copyright {
      color: var(--neutral-400);
    }
    
    @media (max-width: 768px) {
      .categories-grid,
      .services-grid {
        grid-template-columns: 1fr;
      }
      
      .section-title {
        font-size: var(--text-2xl);
      }
      
      .benefits-grid {
        grid-template-columns: 1fr;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  categories: ServiceCategory[] = [];
  featuredServices: Service[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.dataService.getServices().subscribe(services => {
      // Get top-rated services as featured
      this.featuredServices = services
        .filter(service => service.isActive)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    });
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/services'], { queryParams: { category: categoryId } });
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/services', serviceId]);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { DataService } from '../../services/data.service';
import { Service, ServiceCategory } from '../../models/interfaces';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <main class="services-page">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">Our Services</h1>
          <p class="page-subtitle">
            Choose from our wide range of professional home services
          </p>
        </div>
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filter-group">
            <label class="filter-label">Search Services</label>
            <div class="search-input">
              <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                (input)="filterServices()"
                placeholder="Search for services..."
                class="input"
              />
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Category</label>
            <select [(ngModel)]="selectedCategory" (change)="filterServices()" class="input">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Price Range</label>
            <select [(ngModel)]="selectedPriceRange" (change)="filterServices()" class="input">
              <option value="">Any Price</option>
              <option value="0-50">$0 - $50</option>
              <option value="51-100">$51 - $100</option>
              <option value="101-200">$101 - $200</option>
              <option value="200+">$200+</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Sort By</label>
            <select [(ngModel)]="sortBy" (change)="filterServices()" class="input">
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        
        <!-- Results Header -->
        <div class="results-header">
          <h2 class="results-count">
            {{ filteredServices.length }} service{{ filteredServices.length !== 1 ? 's' : '' }} found
          </h2>
          <button class="btn btn-outline btn-sm" (click)="clearFilters()">
            Clear Filters
          </button>
        </div>
        
        <!-- Services Grid -->
        <div class="services-grid" *ngIf="filteredServices.length > 0">
          <div *ngFor="let service of filteredServices" class="service-card">
            <div class="service-image">
              <img [src]="service.image" [alt]="service.title">
              <div class="service-badge">
                <span class="rating">⭐ {{ service.rating }}</span>
                <span class="reviews">({{ service.reviewCount }})</span>
              </div>
            </div>
            
            <div class="service-content">
              <div class="service-header">
                <div class="service-category-badge">{{ service.category.name }}</div>
                <div class="service-duration">{{ service.duration }}min</div>
              </div>
              
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
              
              <div class="service-features">
                <div *ngFor="let feature of service.features.slice(0, 3)" class="feature-item">
                  <span class="feature-icon">✓</span>
                  {{ feature }}
                </div>
              </div>
              
              <div class="service-footer">
                <div class="service-price">
                  <span class="price-label">Starting at</span>
                  <span class="price-value">\${{ service.price }}</span>
                </div>
                <button 
                  (click)="bookService(service)" 
                  class="btn btn-primary"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Results -->
        <div *ngIf="filteredServices.length === 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3 class="no-results-title">No services found</h3>
          <p class="no-results-message">
            Try adjusting your search criteria or browse all our services.
          </p>
          <button (click)="clearFilters()" class="btn btn-primary">
            View All Services
          </button>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .services-page {
      padding: var(--space-8) 0 var(--space-20);
      min-height: calc(100vh - 80px);
    }
    
    .page-header {
      text-align: center;
      margin-bottom: var(--space-12);
    }
    
    .page-title {
      font-size: var(--text-3xl);
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
    }
    
    .page-subtitle {
      font-size: var(--text-lg);
      color: var(--neutral-600);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .filters-section {
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius-lg);
      padding: var(--space-6);
      margin-bottom: var(--space-8);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    
    .filter-label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
    }
    
    .search-input {
      position: relative;
    }
    
    .search-icon {
      position: absolute;
      left: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--neutral-400);
    }
    
    .search-input .input {
      padding-left: var(--space-10);
    }
    
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-8);
    }
    
    .results-count {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--neutral-900);
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-6);
    }
    
    .service-card {
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }
    
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-300);
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
      top: var(--space-3);
      right: var(--space-3);
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
    
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }
    
    .service-category-badge {
      background: var(--primary-100);
      color: var(--primary-600);
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
      font-size: var(--text-xs);
      font-weight: 500;
    }
    
    .service-duration {
      background: var(--neutral-100);
      color: var(--neutral-600);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--border-radius);
      font-size: var(--text-xs);
      font-weight: 500;
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
      border-top: 1px solid var(--neutral-200);
      padding-top: var(--space-4);
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
      color: var(--primary-600);
    }
    
    .no-results {
      text-align: center;
      padding: var(--space-20) var(--space-4);
    }
    
    .no-results-icon {
      font-size: 4rem;
      margin-bottom: var(--space-6);
      opacity: 0.5;
    }
    
    .no-results-title {
      font-size: var(--text-2xl);
      font-weight: 600;
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
    }
    
    .no-results-message {
      color: var(--neutral-600);
      margin-bottom: var(--space-8);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    
    @media (max-width: 768px) {
      .filters-section {
        grid-template-columns: 1fr;
      }
      
      .services-grid {
        grid-template-columns: 1fr;
      }
      
      .results-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: stretch;
      }
      
      .page-title {
        font-size: var(--text-2xl);
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  categories: ServiceCategory[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  sortBy: string = 'popular';

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataService.getServices().subscribe(services => {
      this.services = services.filter(service => service.isActive);
      this.filteredServices = [...this.services];
      this.filterServices();
    });

    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    // Check for category filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.filterServices();
      }
    });
  }

  filterServices(): void {
    let filtered = [...this.services];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.category.name.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(service => service.category.id === this.selectedCategory);
    }

    // Price range filter
    if (this.selectedPriceRange) {
      const [min, max] = this.selectedPriceRange.split('-').map(p => p.replace('+', ''));
      filtered = filtered.filter(service => {
        if (max) {
          return service.price >= parseInt(min) && service.price <= parseInt(max);
        } else {
          return service.price >= parseInt(min);
        }
      });
    }

    // Sort
    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // popular
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    this.filteredServices = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    this.sortBy = 'popular';
    this.filterServices();
  }

  bookService(service: Service): void {
    this.router.navigate(['/booking'], { queryParams: { serviceId: service.id } });
  }
}
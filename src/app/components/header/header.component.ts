import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="nav-brand" (click)="navigateHome()">
            <div class="logo">
              <span class="logo-icon">🔧</span>
              <span class="logo-text">ServicePro</span>
            </div>
          </div>
          
          <div class="nav-menu" [class.nav-menu-open]="isMenuOpen">
            <a (click)="navigateTo('/')" class="nav-link">Home</a>
            <a (click)="navigateTo('/services')" class="nav-link">Services</a>
            <a (click)="navigateTo('/about')" class="nav-link">About</a>
            <a (click)="navigateTo('/contact')" class="nav-link">Contact</a>
            
            <div class="nav-actions">
              <ng-container *ngIf="currentUser; else notLoggedIn">
                <div class="user-menu">
                  <button class="user-button" (click)="toggleUserMenu()">
                    <span class="user-avatar">{{ getUserInitials() }}</span>
                    <span class="user-name">{{ currentUser.name }}</span>
                    <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div class="user-dropdown" [class.user-dropdown-open]="isUserMenuOpen">
                    <a (click)="navigateTo('/dashboard')" class="dropdown-item">
                      <span class="dropdown-icon-wrapper">📊</span>
                      Dashboard
                    </a>
                    <a *ngIf="currentUser.role === 'admin'" (click)="navigateTo('/admin')" class="dropdown-item">
                      <span class="dropdown-icon-wrapper">⚙️</span>
                      Admin Panel
                    </a>
                    <a (click)="navigateTo('/profile')" class="dropdown-item">
                      <span class="dropdown-icon-wrapper">👤</span>
                      Profile
                    </a>
                    <hr class="dropdown-divider">
                    <button (click)="logout()" class="dropdown-item logout-btn">
                      <span class="dropdown-icon-wrapper">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              </ng-container>
              
              <ng-template #notLoggedIn>
                <button (click)="navigateTo('/login')" class="btn btn-outline">Login</button>
                <button (click)="navigateTo('/register')" class="btn btn-primary">Sign Up</button>
              </ng-template>
            </div>
          </div>
          
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <span class="hamburger"></span>
            <span class="hamburger"></span>
            <span class="hamburger"></span>
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      border-bottom: 1px solid var(--neutral-200);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }
    
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) 0;
    }
    
    .nav-brand {
      cursor: pointer;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .logo-icon {
      font-size: var(--text-2xl);
    }
    
    .logo-text {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--primary-600);
    }
    
    .nav-menu {
      display: flex;
      align-items: center;
      gap: var(--space-8);
    }
    
    .nav-link {
      color: var(--neutral-600);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s ease-in-out;
    }
    
    .nav-link:hover {
      color: var(--primary-600);
    }
    
    .nav-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    
    .user-menu {
      position: relative;
    }
    
    .user-button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-2);
      border-radius: var(--border-radius);
      transition: background-color 0.2s ease-in-out;
    }
    
    .user-button:hover {
      background-color: var(--neutral-100);
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--primary-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: var(--text-sm);
    }
    
    .user-name {
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .dropdown-icon {
      width: 16px;
      height: 16px;
      color: var(--neutral-500);
    }
    
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease-in-out;
      z-index: 200;
    }
    
    .user-dropdown-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      color: var(--neutral-700);
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }
    
    .dropdown-item:hover {
      background-color: var(--neutral-50);
    }
    
    .dropdown-icon-wrapper {
      font-size: var(--text-sm);
    }
    
    .dropdown-divider {
      border: none;
      border-top: 1px solid var(--neutral-200);
      margin: var(--space-1) 0;
    }
    
    .logout-btn:hover {
      background-color: #fef2f2;
      color: var(--error-500);
    }
    
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-2);
    }
    
    .hamburger {
      width: 20px;
      height: 2px;
      background-color: var(--neutral-600);
      transition: all 0.2s ease-in-out;
    }
    
    @media (max-width: 768px) {
      .nav-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid var(--neutral-200);
        flex-direction: column;
        align-items: stretch;
        padding: var(--space-4);
        gap: var(--space-4);
      }
      
      .nav-menu-open {
        display: flex;
      }
      
      .mobile-menu-btn {
        display: flex;
      }
      
      .nav-actions {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
      }
      
      .user-dropdown {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        border: none;
        margin-top: var(--space-4);
      }
    }
  `]
})
export class HeaderComponent {
  currentUser: User | null = null;
  isMenuOpen = false;
  isUserMenuOpen = false;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.dataService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  navigateHome(): void {
    this.router.navigate(['/']);
    this.closeMenus();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenus();
  }

  toggleMobileMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const names = this.currentUser.name.split(' ');
    return names.map(name => name.charAt(0)).join('').toUpperCase();
  }

  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/']);
    this.closeMenus();
  }

  private closeMenus(): void {
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }
}
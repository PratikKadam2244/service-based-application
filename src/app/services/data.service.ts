import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Service, ServiceCategory, Booking, User, AdminStats, TimeSlot } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private servicesSubject = new BehaviorSubject<Service[]>(this.getMockServices());
  public services$ = this.servicesSubject.asObservable();

  private bookingsSubject = new BehaviorSubject<Booking[]>(this.getMockBookings());
  public bookings$ = this.bookingsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<ServiceCategory[]>(this.getMockCategories());
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    // Mock admin user login on init
    this.currentUserSubject.next({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@servicebooking.com',
      phone: '+1234567890',
      role: 'admin',
      createdAt: new Date()
    });
  }

  // Service Methods
  getServices(): Observable<Service[]> {
    return this.services$;
  }

  getServiceById(id: string): Service | undefined {
    return this.servicesSubject.value.find(service => service.id === id);
  }

  getServicesByCategory(categoryId: string): Service[] {
    return this.servicesSubject.value.filter(service => service.category.id === categoryId);
  }

  addService(service: Service): void {
    const services = [...this.servicesSubject.value, service];
    this.servicesSubject.next(services);
  }

  updateService(updatedService: Service): void {
    const services = this.servicesSubject.value.map(service => 
      service.id === updatedService.id ? updatedService : service
    );
    this.servicesSubject.next(services);
  }

  deleteService(serviceId: string): void {
    const services = this.servicesSubject.value.filter(service => service.id !== serviceId);
    this.servicesSubject.next(services);
  }

  // Booking Methods
  getBookings(): Observable<Booking[]> {
    return this.bookings$;
  }

  getUserBookings(userId: string): Booking[] {
    return this.bookingsSubject.value.filter(booking => booking.userId === userId);
  }

  addBooking(booking: Booking): void {
    const bookings = [...this.bookingsSubject.value, booking];
    this.bookingsSubject.next(bookings);
  }

  updateBookingStatus(bookingId: string, status: Booking['status']): void {
    const bookings = this.bookingsSubject.value.map(booking => 
      booking.id === bookingId ? { ...booking, status, updatedAt: new Date() } : booking
    );
    this.bookingsSubject.next(bookings);
  }

  // Category Methods
  getCategories(): Observable<ServiceCategory[]> {
    return this.categories$;
  }

  // Time Slot Methods
  getAvailableTimeSlots(date: string): TimeSlot[] {
    // Mock time slots - in real app, this would check actual availability
    const slots = [
      '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
      '05:00 PM', '06:00 PM'
    ];
    
    return slots.map(time => ({
      time,
      available: Math.random() > 0.3 // Mock availability
    }));
  }

  // Admin Methods
  getAdminStats(): AdminStats {
    const bookings = this.bookingsSubject.value;
    const services = this.servicesSubject.value;
    
    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      totalRevenue: bookings.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0),
      monthlyRevenue: bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && 
               bookingDate.getFullYear() === now.getFullYear() &&
               b.status === 'completed';
      }).reduce((sum, b) => sum + b.totalAmount, 0),
      popularServices: services.map(service => ({
        service,
        bookingCount: bookings.filter(b => b.serviceId === service.id).length
      })).sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5)
    };
  }

  // Authentication Methods
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): boolean {
    // Mock authentication
    if (email === 'admin@test.com' && password === 'admin') {
      this.currentUserSubject.next({
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@test.com',
        phone: '+1234567890',
        role: 'admin',
        createdAt: new Date()
      });
      return true;
    } else if (email === 'user@test.com' && password === 'user') {
      this.currentUserSubject.next({
        id: 'user-1',
        name: 'John Doe',
        email: 'user@test.com',
        phone: '+1234567890',
        role: 'user',
        createdAt: new Date()
      });
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  // Mock Data
  private getMockCategories(): ServiceCategory[] {
    return [
      {
        id: 'cat-1',
        name: 'AC Repair & Maintenance',
        icon: '❄️',
        description: 'Professional air conditioning services'
      },
      {
        id: 'cat-2',
        name: 'Plumbing Services',
        icon: '🔧',
        description: 'Expert plumbing solutions'
      },
      {
        id: 'cat-3',
        name: 'House Cleaning',
        icon: '🧹',
        description: 'Professional cleaning services'
      },
      {
        id: 'cat-4',
        name: 'Electrical Work',
        icon: '⚡',
        description: 'Certified electrical services'
      },
      {
        id: 'cat-5',
        name: 'Painting Services',
        icon: '🎨',
        description: 'Interior and exterior painting'
      },
      {
        id: 'cat-6',
        name: 'Appliance Repair',
        icon: '🔨',
        description: 'Home appliance maintenance'
      }
    ];
  }

  private getMockServices(): Service[] {
    const categories = this.getMockCategories();
    
    return [
      {
        id: 'service-1',
        title: 'AC Installation & Repair',
        description: 'Complete AC installation, repair, and maintenance services for all brands',
        category: categories[0],
        price: 150,
        duration: 120,
        image: 'https://images.pexels.com/photos/1179532/pexels-photo-1179532.jpeg?auto=compress&cs=tinysrgb&w=500',
        isActive: true,
        features: ['Brand warranty', 'Same day service', 'Expert technicians', '24/7 support'],
        rating: 4.8,
        reviewCount: 245
      },
      {
        id: 'service-2',
        title: 'Plumbing Emergency Fix',
        description: 'Emergency plumbing services for leaks, blocks, and pipe repairs',
        category: categories[1],
        price: 100,
        duration: 90,
        image: 'https://images.pexels.com/photos/8961323/pexels-photo-8961323.jpeg?auto=compress&cs=tinysrgb&w=500',
        isActive: true,
        features: ['24/7 emergency service', 'Licensed plumbers', 'Quality guarantee', 'Upfront pricing'],
        rating: 4.7,
        reviewCount: 189
      },
      {
        id: 'service-3',
        title: 'Deep House Cleaning',
        description: 'Comprehensive deep cleaning service for your entire home',
        category: categories[2],
        price: 80,
        duration: 180,
        image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=500',
        isActive: true,
        features: ['Eco-friendly products', 'Trained staff', 'Insurance covered', 'Satisfaction guarantee'],
        rating: 4.9,
        reviewCount: 312
      },
      {
        id: 'service-4',
        title: 'Electrical Wiring & Installation',
        description: 'Professional electrical installation and wiring services',
        category: categories[3],
        price: 120,
        duration: 150,
        image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=500',
        isActive: true,
        features: ['Licensed electricians', 'Safety certified', 'Code compliant', '1 year warranty'],
        rating: 4.6,
        reviewCount: 156
      },
      {
        id: 'service-5',
        title: 'Interior Wall Painting',
        description: 'Professional interior painting with premium quality paints',
        category: categories[4],
        price: 200,
        duration: 480,
        image: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=500',
        isActive: true,
        features: ['Premium paints', 'Color consultation', 'Clean finish', 'Quick turnaround'],
        rating: 4.5,
        reviewCount: 98
      },
      {
        id: 'service-6',
        title: 'Washing Machine Repair',
        description: 'Expert washing machine repair and maintenance for all brands',
        category: categories[5],
        price: 75,
        duration: 60,
        image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=500',
        isActive: true,
        features: ['All brand support', 'Genuine parts', 'Same day service', '3 month warranty'],
        rating: 4.4,
        reviewCount: 134
      }
    ];
  }

  private getMockBookings(): Booking[] {
    return [
      {
        id: 'booking-1',
        userId: 'user-1',
        serviceId: 'service-1',
        date: new Date('2024-01-15'),
        timeSlot: '10:00 AM',
        status: 'confirmed',
        customerName: 'John Smith',
        customerPhone: '+1234567890',
        customerEmail: 'john@email.com',
        address: '123 Main Street, City, State 12345',
        notes: 'AC not cooling properly',
        totalAmount: 150,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: 'booking-2',
        userId: 'user-2',
        serviceId: 'service-2',
        date: new Date('2024-01-16'),
        timeSlot: '02:00 PM',
        status: 'pending',
        customerName: 'Sarah Johnson',
        customerPhone: '+1234567891',
        customerEmail: 'sarah@email.com',
        address: '456 Oak Avenue, City, State 12345',
        notes: 'Kitchen sink is blocked',
        totalAmount: 100,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: 'booking-3',
        userId: 'user-3',
        serviceId: 'service-3',
        date: new Date('2024-01-18'),
        timeSlot: '09:00 AM',
        status: 'completed',
        customerName: 'Mike Wilson',
        customerPhone: '+1234567892',
        customerEmail: 'mike@email.com',
        address: '789 Pine Street, City, State 12345',
        notes: 'Need deep cleaning before party',
        totalAmount: 80,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-18')
      }
    ];
  }
}
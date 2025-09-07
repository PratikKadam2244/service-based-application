// Core interfaces for the service booking platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: Date;
  avatar?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number; // in minutes
  image: string;
  isActive: boolean;
  features: string[];
  rating: number;
  reviewCount: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  timeSlot: string;
  status: BookingStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  notes?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  service?: Service;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingFormData {
  serviceId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  notes?: string;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  popularServices: Array<{
    service: Service;
    bookingCount: number;
  }>;
}

export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'reminder' | 'update';
  isRead: boolean;
  createdAt: Date;
}
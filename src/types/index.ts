// Types for the appointment booking system

export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration: number;
  category: string;
}

export interface ServiceWithQuantity {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  quantity: number;
  totalPrice: number;
  totalDuration: number;
}

export interface AppointmentService {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  quantity: number;
}

export interface ServiceSelection {
  [serviceId: string]: number; // serviceId -> quantity
}

export interface PricingBreakdown {
  services: ServiceWithQuantity[];
  subtotal: number;
  transportCost: number;
  total: number;
  totalDuration: number;
}

export type LocationType = "STUDIO" | "HOME";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  isActive: boolean;
}
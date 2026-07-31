export interface ServiceImage {
  id: string;
  serviceId: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  cost?: number | null;
  videoUrl?: string | null;
  images?: ServiceImage[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  key?: string;
  url: string;
  isPrimary?: boolean;
  alt?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  isActive: boolean;
  cost: string;
  videoUrl: string;
  images: MediaItem[];
}

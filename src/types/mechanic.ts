
import { ServiceType } from '@/components/ServiceCard';

export interface Mechanic {
  id: string;
  name: string;
  rating: number;
  distance: string;
  estimatedArrival: string;
  address: string;
  services: Record<ServiceType, boolean>;
  image: string;
  latitude?: number;
  longitude?: number;
}

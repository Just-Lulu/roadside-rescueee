
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export type ServiceType = 
  | 'towing' 
  | 'jumpStart' 
  | 'tireFix' 
  | 'fuelDelivery' 
  | 'lockoutService' 
  | 'basicRepair';

interface ServiceCardProps {
  services: Record<ServiceType, boolean>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ services }) => {
  // Service details with icons and descriptions
  const serviceDetails = {
    towing: {
      name: 'Towing Service',
      description: 'Vehicle transport to repair location'
    },
    jumpStart: {
      name: 'Jump Start',
      description: 'Battery jump start service'
    },
    tireFix: {
      name: 'Flat Tire Fix',
      description: 'Tire change or repair'
    },
    fuelDelivery: {
      name: 'Fuel Delivery',
      description: 'Emergency fuel when you run out'
    },
    lockoutService: {
      name: 'Lockout Service',
      description: 'Help when keys are locked inside'
    },
    basicRepair: {
      name: 'Basic Repairs',
      description: 'Minor mechanical fixes on-site'
    }
  };

  // Count active services
  const activeServiceCount = Object.values(services).filter(Boolean).length;

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Services Offered</h3>
        
        {activeServiceCount === 0 && (
          <p className="text-gray-500 text-sm italic">No services specified</p>
        )}

        <div className="grid grid-cols-1 gap-3 mt-4">
          {Object.entries(services).map(([key, isActive]) => {
            if (!isActive) return null;
            
            const service = key as ServiceType;
            const details = serviceDetails[service];
            
            return (
              <div key={service} className="flex items-start space-x-2">
                <div className="mt-0.5 bg-green-100 rounded-full p-1">
                  <Check size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{details.name}</p>
                  <p className="text-sm text-gray-500">{details.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

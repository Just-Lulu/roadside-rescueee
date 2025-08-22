
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Route, Lock, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ServiceCard, { ServiceType } from '@/components/ServiceCard';
import { Mechanic } from '@/types/mechanic';
import { useAuth } from '@/hooks/useAuth';

interface MechanicCardProps {
  mechanic: Mechanic;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const MechanicCard: React.FC<MechanicCardProps> = ({ 
  mechanic, 
  isSelected, 
  onSelect 
}) => {
  const { user } = useAuth();

  return (
    <Card 
      key={mechanic.id} 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary shadow-md' 
          : 'hover:border-primary/20'
      }`}
      onClick={() => onSelect(mechanic.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img 
                src={mechanic.image} 
                alt={mechanic.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{mechanic.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500 flex items-center">
                    ★ {mechanic.rating}
                  </span>
                  {user && (
                    <>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground flex items-center text-sm">
                        <MapPin size={14} className="mr-1" />
                        {mechanic.distance} km away
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Badge variant="secondary">
                {mechanic.estimatedArrival} min
              </Badge>
            </div>
            
            {user ? (
              <p className="text-muted-foreground text-sm mt-2 flex items-center">
                <Route size={14} className="mr-1" />
                {mechanic.address}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm mt-2 flex items-center">
                <Lock size={14} className="mr-1" />
                <Link to="/login" className="text-primary hover:underline">
                  Sign in to view location details
                </Link>
              </p>
            )}
            
            {isSelected && (
              <div className="mt-4 pt-4 border-t border-border">
                <ServiceCard services={mechanic.services as Record<ServiceType, boolean>} />
                <div className="mt-4 flex gap-2">
                  <Link to={`/mechanic-profile/${mechanic.id}`} className="flex-grow">
                    <Button className="w-full" variant="default">
                      View Profile
                    </Button>
                  </Link>
                  {user ? (
                    <Link to={`/request-help/${mechanic.id}`} className="flex-grow">
                      <Button className="w-full" variant="secondary">
                        Request Help
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login" className="flex-grow">
                      <Button className="w-full" variant="secondary">
                        <Lock size={16} className="mr-2" />
                        Sign In to Request
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MechanicCard;

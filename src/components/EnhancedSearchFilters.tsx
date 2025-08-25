import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Filter, X, Star, Clock, MapPin } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange?: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  maxDistance: number;
  availableOnly: boolean;
  minRating: number;
  maxResponseTime: number;
  services: string[];
  sortBy: 'distance' | 'rating' | 'response_time' | 'price';
  sortOrder: 'asc' | 'desc';
}

const defaultFilters: SearchFilters = {
  maxDistance: 10,
  availableOnly: true,
  minRating: 0,
  maxResponseTime: 60,
  services: [],
  sortBy: 'distance',
  sortOrder: 'asc'
};

const availableServices = [
  'Towing',
  'Jump Start', 
  'Tire Change',
  'Fuel Delivery',
  'Lockout Service',
  'Basic Repair'
];

const EnhancedSearchFilters: React.FC<SearchFiltersProps> = ({ 
  onFiltersChange, 
  className 
}) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const toggleService = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    updateFilters({ services: newServices });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const activeFiltersCount = [
    filters.availableOnly,
    filters.minRating > 0,
    filters.maxResponseTime < 60,
    filters.services.length > 0,
  ].filter(Boolean).length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Sort Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="flex gap-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value: any) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Distance
                    </div>
                  </SelectItem>
                  <SelectItem value="rating">
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      Rating
                    </div>
                  </SelectItem>
                  <SelectItem value="response_time">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Response Time
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.sortOrder} 
                onValueChange={(value: any) => updateFilters({ sortOrder: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    {filters.sortBy === 'distance' ? 'Nearest' : 
                     filters.sortBy === 'rating' ? 'Lowest' : 'Fastest'}
                  </SelectItem>
                  <SelectItem value="desc">
                    {filters.sortBy === 'distance' ? 'Farthest' : 
                     filters.sortBy === 'rating' ? 'Highest' : 'Slowest'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Distance Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Max Distance: {filters.maxDistance}km
            </Label>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={([value]) => updateFilters({ maxDistance: value })}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Availability Filter */}
          <div className="flex items-center space-x-2">
            <Switch
              id="available-only"
              checked={filters.availableOnly}
              onCheckedChange={(checked) => updateFilters({ availableOnly: checked })}
            />
            <Label htmlFor="available-only" className="text-sm">
              Available mechanics only
            </Label>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}★` : 'Any'}
            </Label>
            <Slider
              value={[filters.minRating]}
              onValueChange={([value]) => updateFilters({ minRating: value })}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Response Time Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Max Response Time: {filters.maxResponseTime} minutes
            </Label>
            <Slider
              value={[filters.maxResponseTime]}
              onValueChange={([value]) => updateFilters({ maxResponseTime: value })}
              max={120}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          {/* Service Type Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Services Needed</Label>
            <div className="flex flex-wrap gap-2">
              {availableServices.map((service) => (
                <Badge
                  key={service}
                  variant={filters.services.includes(service) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleService(service)}
                >
                  {service}
                  {filters.services.includes(service) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedSearchFilters;
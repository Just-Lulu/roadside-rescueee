import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { MechanicProfile } from '@/hooks/useMechanicProfiles';

interface MechanicProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: MechanicProfile | null;
  onSave: (data: Partial<MechanicProfile>) => Promise<void>;
}

export function MechanicProfileForm({ isOpen, onClose, profile, onSave }: MechanicProfileFormProps) {
  const [formData, setFormData] = useState({
    business_name: profile?.business_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    is_available: profile?.is_available ?? true,
    average_response_time: profile?.average_response_time || 30,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name.trim()) {
      toast.error('Business name is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }));
            toast.success('Location found!');
          }
        } catch (error) {
          console.error('Error getting address:', error);
          setFormData(prev => ({ ...prev, address: `${latitude}, ${longitude}` }));
          toast.info('Using coordinates as address');
        }
      },
      (error) => {
        toast.error('Unable to get your location');
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {profile ? 'Edit Profile' : 'Create Mechanic Profile'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Your Auto Services"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <div className="flex space-x-2">
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your business address"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGetCurrentLocation}
                className="px-3"
              >
                Use Current Location
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell customers about your services and experience..."
              className="h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="response_time">Average Response Time (minutes)</Label>
              <Input
                id="response_time"
                type="number"
                min="5"
                max="120"
                value={formData.average_response_time}
                onChange={(e) => setFormData(prev => ({ ...prev, average_response_time: parseInt(e.target.value) || 30 }))}
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_available"
                checked={formData.is_available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
              />
              <Label htmlFor="is_available">Currently Available for Work</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
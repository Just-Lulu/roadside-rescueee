import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Star, Edit } from 'lucide-react';
import type { MechanicProfile } from '@/hooks/useMechanicProfiles';

interface MechanicProfileCardProps {
  profile: MechanicProfile;
  onEdit: () => void;
}

export function MechanicProfileCard({ profile, onEdit }: MechanicProfileCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{profile.business_name}</CardTitle>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-semibold">{profile.rating || 0}</span>
            </div>
            <span className="text-muted-foreground">({profile.review_count || 0} reviews)</span>
            <Badge variant={profile.is_available ? "default" : "secondary"}>
              {profile.is_available ? "Available" : "Unavailable"}
            </Badge>
          </div>
          
          {profile.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
          )}

          {profile.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.address}</span>
            </div>
          )}

          {profile.average_response_time && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Avg. response: {profile.average_response_time} minutes</span>
            </div>
          )}

          {profile.bio && (
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
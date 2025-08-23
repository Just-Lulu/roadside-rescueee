
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Car, MapPin, Phone, Star, Plus } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { useProfiles } from '@/hooks/useProfiles';
import { useMechanicProfiles } from '@/hooks/useMechanicProfiles';
import { MechanicProfileCard } from '@/components/dashboard/MechanicProfileCard';
import { MechanicProfileForm } from '@/components/dashboard/MechanicProfileForm';
import { DashboardCardSkeleton, ServiceRequestSkeleton } from '@/components/LoadingStates';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { requests, loading: requestsLoading } = useServiceRequests();
  const { profile } = useProfiles();
  const { profiles: mechanicProfiles, loading: mechanicLoading, createProfile, updateProfile } = useMechanicProfiles();
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  // Determine if user is a mechanic based on user metadata
  const isMechanic = user.user_metadata?.user_type === 'mechanic';
  const currentMechanicProfile = mechanicProfiles.find(p => p.user_id === user.id);

  const handleCreateOrEditProfile = async (data: any) => {
    if (editingProfile) {
      await updateProfile(editingProfile.id, data);
    } else {
      await createProfile({
        ...data,
        business_name: data.business_name || user.user_metadata?.business_name || 'Business Name Required',
        phone: data.phone || user.user_metadata?.phone,
      });
    }
    setEditingProfile(null);
  };

  const handleEditProfile = () => {
    setEditingProfile(currentMechanicProfile);
    setIsProfileFormOpen(true);
  };

  const handleCreateProfile = () => {
    setEditingProfile(null);
    setIsProfileFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, {profile?.first_name || user.user_metadata?.business_name || user.email}!
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isMechanic 
                ? 'Manage your mechanic services and view incoming requests'
                : 'Manage your vehicles and service requests'
              }
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {!isMechanic && <TabsTrigger value="vehicles">Vehicles</TabsTrigger>}
              <TabsTrigger value="requests">
                {isMechanic ? 'Service Requests' : 'My Requests'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(isMechanic ? currentMechanicProfile : profile) ? 'Complete' : 'Incomplete'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(isMechanic ? currentMechanicProfile : profile) ? 'Your profile is ready' : 'Complete your profile setup'}
                    </p>
                  </CardContent>
                </Card>

                {!isMechanic && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{vehicles?.length || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        Registered vehicles
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isMechanic ? 'Service Requests' : 'My Requests'}
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{requests?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {isMechanic ? 'Pending requests' : 'Total requests'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {isMechanic && currentMechanicProfile && (
                <MechanicProfileCard 
                  profile={currentMechanicProfile} 
                  onEdit={handleEditProfile}
                />
              )}

              {isMechanic && !currentMechanicProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Your Mechanic Profile</CardTitle>
                    <CardDescription>
                      Create your professional profile to start receiving service requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleCreateProfile}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Mechanic Profile
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isMechanic && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Manage your mechanic services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4">
                    <Button onClick={() => setActiveTab('profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Update Profile
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('requests')}>
                      <MapPin className="mr-2 h-4 w-4" />
                      View Requests
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!isMechanic && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Manage your account and vehicles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4">
                    <Button onClick={() => navigate('/vehicle-management')}>
                      <Car className="mr-2 h-4 w-4" />
                      Manage Vehicles
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/find-mechanic')}>
                      <MapPin className="mr-2 h-4 w-4" />
                      Find Mechanic
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and manage your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Account Type</label>
                      <p className="text-sm text-muted-foreground">
                        {isMechanic ? 'Mechanic' : 'Customer'}
                      </p>
                    </div>
                    {profile?.first_name && (
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <p className="text-sm text-muted-foreground">
                          {profile.first_name} {profile.last_name}
                        </p>
                      </div>
                    )}
                    {profile?.phone && (
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-muted-foreground">{profile.phone}</p>
                      </div>
                    )}
                  </div>
                  
                  {isMechanic && user.user_metadata?.business_name && (
                    <div>
                      <label className="text-sm font-medium">Business Name</label>
                      <p className="text-sm text-muted-foreground">
                        {user.user_metadata.business_name}
                      </p>
                    </div>
                  )}

                  {isMechanic && !currentMechanicProfile && (
                    <Button onClick={handleCreateProfile}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Professional Profile
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {!isMechanic && (
              <TabsContent value="vehicles" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Vehicles</h2>
                  <Button onClick={() => navigate('/vehicle-management')}>
                    <Car className="mr-2 h-4 w-4" />
                    Manage Vehicles
                  </Button>
                </div>
                
                {vehiclesLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-pulse-slow">Loading vehicles...</div>
                  </div>
                ) : vehicles && vehicles.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                      <Card key={vehicle.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.color} • {vehicle.license_plate}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No vehicles registered</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your vehicles to get personalized roadside assistance.
                      </p>
                      <Button onClick={() => navigate('/vehicle-management')}>
                        Add Your First Vehicle
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            <TabsContent value="requests" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {isMechanic ? 'Service Requests' : 'My Service Requests'}
                </h2>
                {!isMechanic && (
                  <Button onClick={() => navigate('/find-mechanic')}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Request Help
                  </Button>
                )}
              </div>
              
              {requestsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-pulse-slow">Loading requests...</div>
                </div>
              ) : requests && requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{request.issue_type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.description}
                            </p>
                            {request.location_address && (
                              <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {request.location_address}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              request.status === 'completed' ? 'default' :
                              request.status === 'in-progress' ? 'secondary' :
                              'outline'
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isMechanic ? 'No service requests yet' : 'No service requests'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isMechanic 
                        ? 'Service requests from customers will appear here.'
                        : 'When you request roadside assistance, it will appear here.'
                      }
                    </p>
                    {!isMechanic && (
                      <Button onClick={() => navigate('/find-mechanic')}>
                        Request Roadside Assistance
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MechanicProfileForm
        isOpen={isProfileFormOpen}
        onClose={() => setIsProfileFormOpen(false)}
        profile={editingProfile}
        onSave={handleCreateOrEditProfile}
      />
      
      <Footer />
    </div>
  );
};

export default Dashboard;

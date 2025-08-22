
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, Edit, Trash2 } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { useAuth } from '@/hooks/useAuth';

const VehicleManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: ''
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, {
        ...formData,
        year: parseInt(formData.year)
      });
      setEditingVehicle(null);
    } else {
      await addVehicle({
        ...formData,
        year: parseInt(formData.year)
      });
    }
    
    setFormData({ make: '', model: '', year: '', color: '', license_plate: '' });
    setShowAddForm(false);
  };

  const handleEdit = (vehicle: any) => {
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      color: vehicle.color,
      license_plate: vehicle.license_plate
    });
    setEditingVehicle(vehicle);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
  };

  const resetForm = () => {
    setFormData({ make: '', model: '', year: '', color: '', license_plate: '' });
    setEditingVehicle(null);
    setShowAddForm(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Please log in to manage your vehicles.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Vehicle Management</h1>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-roadside-600 hover:bg-roadside-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
          
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        name="make"
                        placeholder="Toyota"
                        value={formData.make}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        placeholder="Camry"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder={formData.year || "Select Year"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        name="color"
                        placeholder="Blue"
                        value={formData.color}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_plate">License Plate</Label>
                      <Input
                        id="license_plate"
                        name="license_plate"
                        placeholder="LAG-123-AB"
                        value={formData.license_plate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-roadside-600 hover:bg-roadside-700">
                      {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-roadside-600" />
                    {vehicle.make} {vehicle.model}
                  </CardTitle>
                  <CardDescription>{vehicle.year} • {vehicle.color}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    License Plate: <span className="font-medium">{vehicle.license_plate}</span>
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {vehicles.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No vehicles added</h3>
                <p className="text-gray-500 mb-4">Add your first vehicle to get started</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-roadside-600 hover:bg-roadside-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VehicleManagement;

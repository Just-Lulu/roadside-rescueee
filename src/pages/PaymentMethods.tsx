
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CreditCard, Plus, Trash2, Shield } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  isDefault: boolean;
}

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'bank'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    bankName: '',
    accountNumber: ''
  });

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: paymentType,
      last4: paymentType === 'card' ? formData.cardNumber.slice(-4) : formData.accountNumber.slice(-4),
      brand: paymentType === 'card' ? 'Visa' : undefined,
      bankName: paymentType === 'bank' ? formData.bankName : undefined,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    toast.success("Payment method added successfully!");
    
    setFormData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      bankName: '',
      accountNumber: ''
    });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const methodToDelete = paymentMethods.find(pm => pm.id === id);
    setPaymentMethods(prev => {
      const filtered = prev.filter(pm => pm.id !== id);
      if (methodToDelete?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    toast.success("Payment method removed successfully!");
  };

  const setAsDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    toast.success("Default payment method updated!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-roadside-600 hover:bg-roadside-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
          
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Payment Method</CardTitle>
                <CardDescription>
                  Add a credit card or bank account for secure payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>Payment Type</Label>
                  <Select onValueChange={(value: 'card' | 'bank') => setPaymentType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {paymentType === 'card' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          name="cardholderName"
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Year</Label>
                          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          name="bankName"
                          placeholder="First Bank of Nigeria"
                          value={formData.bankName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          name="accountNumber"
                          placeholder="1234567890"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-roadside-600 hover:bg-roadside-700">
                      Add Payment Method
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={method.isDefault ? 'ring-2 ring-roadside-600' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-roadside-600" />
                      {method.type === 'card' ? method.brand : 'Bank Account'}
                    </div>
                    {method.isDefault && (
                      <span className="text-xs bg-roadside-600 text-white px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {method.type === 'card' ? `•••• •••• •••• ${method.last4}` : `${method.bankName} •••• ${method.last4}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setAsDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(method.id)}
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

          {paymentMethods.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No payment methods</h3>
                <p className="text-gray-500 mb-4">Add a payment method for secure transactions</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-roadside-600 hover:bg-roadside-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                Your payment information is encrypted and secure. We never store your full card details.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentMethods;

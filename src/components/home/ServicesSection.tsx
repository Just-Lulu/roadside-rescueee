
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Route, Clock, CreditCard, MessageCircle } from 'lucide-react';

const ServicesSection: React.FC = () => {
  // Sample services
  const services = [
    {
      icon: <Route size={48} className="text-roadside-500" />,
      title: "Towing Service",
      description: "Need a tow? We'll connect you with nearby towing services to get you to a repair shop in Nigeria."
    },
    {
      icon: <Clock size={48} className="text-roadside-500" />,
      title: "Quick Repairs",
      description: "For minor issues, get roadside repairs that get you back on Nigerian roads without a tow."
    },
    {
      icon: <CreditCard size={48} className="text-roadside-500" />,
      title: "Transparent Pricing",
      description: "See estimated costs upfront in Naira. No hidden fees or surprises when the mechanic arrives."
    },
    {
      icon: <MessageCircle size={48} className="text-roadside-500" />,
      title: "Direct Communication",
      description: "Chat directly with your Nigerian mechanic to describe your vehicle issues in detail."
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Services We Offer in Nigeria</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            From flat tires to dead batteries, our mechanics can handle a variety of roadside emergencies across Nigeria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

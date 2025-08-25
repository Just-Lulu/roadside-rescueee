
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Map from '@/components/Map';
import MechanicCard from './MechanicCard';
import { DummyMechanic } from '@/hooks/useDummyMechanics';

interface MechanicListProps {
  mechanics: DummyMechanic[];
  selectedMechanic: string | null;
  toggleMechanicSelection: (id: string) => void;
  location: string;
}

const MechanicList: React.FC<MechanicListProps> = ({ 
  mechanics, 
  selectedMechanic, 
  toggleMechanicSelection,
  location
}) => {
  return (
    <div className="lg:w-1/2">
      <Tabs defaultValue="list">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Mechanics near {location}
          </h2>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-4 mt-0">
          {mechanics.map((mechanic) => (
            <MechanicCard
              key={mechanic.id}
              mechanic={mechanic}
              isSelected={selectedMechanic === mechanic.id}
              onToggleSelection={() => toggleMechanicSelection(mechanic.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="map">
          <div className="h-[500px] lg:hidden">
            <Map className="h-full w-full" />
          </div>
          <p className="text-center text-gray-500 text-sm mt-4 lg:hidden">
            Tap on a marker to see mechanic details
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MechanicList;

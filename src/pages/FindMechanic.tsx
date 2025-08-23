
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchForm from '@/components/mechanic-search/SearchForm';
import SearchResults from '@/components/mechanic-search/SearchResults';
import { useMechanicSearch } from '@/hooks/useMechanicSearch';

const FindMechanic = () => {
  const {
    location,
    setLocation,
    selectedCity,
    isSearching,
    mechanics,
    selectedMechanic,
    currentLocation,
    handleSearch,
    handleCityChange,
    handleUseLocation,
    toggleMechanicSelection,
    handleRadiusChange
  } = useMechanicSearch();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Find Roadside Assistance in Nigeria</h1>
            <p className="mt-2 text-muted-foreground">
              Search for mechanics near your location who can help with your vehicle issues
            </p>
          </div>
          
          {/* Search Form */}
          <SearchForm
            location={location}
            setLocation={setLocation}
            selectedCity={selectedCity}
            handleCityChange={handleCityChange}
            handleSearch={handleSearch}
            handleUseLocation={handleUseLocation}
            isSearching={isSearching}
          />
          
        {location && (
          <SearchResults
            location={location}
            mechanics={mechanics}
            selectedMechanic={selectedMechanic}
            toggleMechanicSelection={toggleMechanicSelection}
            currentLocation={currentLocation}
            onRadiusChange={handleRadiusChange}
          />
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FindMechanic;

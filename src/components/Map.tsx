import React, { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  className?: string;
  center?: { lat: number; lng: number } | [number, number] | null;
  mechanics?: Array<{ id: string; lat?: number; lng?: number; name?: string; distanceKm?: string }>;
  selectedMechanicId?: string | null;
  onMechanicClick?: (mechanicId: string) => void;
  searchRadius?: number;
}

const DEFAULT_CENTER: [number, number] = [9.0765, 7.3986]; // Abuja

// Custom marker icons
const createCustomIcon = (color: string, size: 'small' | 'large' = 'small') => {
  const iconSize = size === 'large' ? 25 : 20;
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${iconSize}px;
      height: ${iconSize}px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${iconSize > 20 ? '12px' : '10px'};
      font-weight: bold;
      color: white;
    ">🔧</div>`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });
};

const createLocationIcon = () => {
  return L.divIcon({
    className: 'location-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background-color: #2563eb;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -8px;
        left: -8px;
        width: 32px;
        height: 32px;
        background-color: rgba(37, 99, 235, 0.2);
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    </style>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const Map: React.FC<MapProps> = ({ 
  className = '', 
  center = null, 
  mechanics = [], 
  selectedMechanicId = null,
  onMechanicClick,
  searchRadius 
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const normalizedCenter = useMemo<[number, number]>(() => {
    if (!center) return DEFAULT_CENTER;
    if (Array.isArray(center)) return center as [number, number];
    return [center.lat, center.lng];
  }, [center]);

  // Initialize map once
  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(normalizedCenter, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center when it changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(normalizedCenter, mapRef.current.getZoom());
    }
  }, [normalizedCenter]);

  // Update search radius circle
  useEffect(() => {
    if (!mapRef.current || !center) return;

    // Remove existing radius circle
    if (radiusCircleRef.current) {
      mapRef.current.removeLayer(radiusCircleRef.current);
    }

    // Add new radius circle if searchRadius is provided
    if (searchRadius && searchRadius > 0) {
      radiusCircleRef.current = L.circle(normalizedCenter, {
        radius: searchRadius * 1000, // Convert km to meters
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        color: '#3b82f6',
        weight: 2,
        dashArray: '5, 5',
      }).addTo(mapRef.current);
    }
  }, [center, normalizedCenter, searchRadius]);

  // Update markers when data changes
  useEffect(() => {
    if (!markersLayerRef.current) return;

    // Clear previous markers
    markersLayerRef.current.clearLayers();

    // Current location marker
    if (center) {
      const locationMarker = L.marker(normalizedCenter, {
        icon: createLocationIcon(),
      }).bindPopup('<div style="text-align: center; font-weight: 600;">📍 Your Location</div>');
      
      locationMarker.addTo(markersLayerRef.current);
    }

    // Mechanics markers
    mechanics
      .filter(m => typeof m.lat === 'number' && typeof m.lng === 'number')
      .forEach(m => {
        const isSelected = selectedMechanicId === m.id;
        const marker = L.marker([m.lat as number, m.lng as number], {
          icon: createCustomIcon(isSelected ? '#16a34a' : '#dc2626', isSelected ? 'large' : 'small'),
        });

        const popupHtml = `
          <div style="min-width: 200px; padding: 8px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
              ${m.name || 'Mechanic'}
            </div>
            ${m.distanceKm ? `
              <div style="color: #6b7280; font-size: 12px; margin-bottom: 8px;">
                📍 ${m.distanceKm} km away
              </div>
            ` : ''}
            <button 
              onclick="window.mechanicMapClick && window.mechanicMapClick('${m.id}')"
              style="
                background: #2563eb;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                width: 100%;
              "
            >
              ${isSelected ? 'Selected' : 'Select Mechanic'}
            </button>
          </div>
        `;
        
        marker.bindPopup(popupHtml);
        marker.addTo(markersLayerRef.current as L.LayerGroup);

        // Handle marker clicks
        marker.on('click', () => {
          if (onMechanicClick) {
            onMechanicClick(m.id);
          }
        });
      });
  }, [center, normalizedCenter, mechanics, selectedMechanicId, onMechanicClick]);

  // Set up global click handler for popup buttons
  useEffect(() => {
    (window as any).mechanicMapClick = (mechanicId: string) => {
      if (onMechanicClick) {
        onMechanicClick(mechanicId);
      }
    };

    return () => {
      delete (window as any).mechanicMapClick;
    };
  }, [onMechanicClick]);

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden relative ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {mechanics.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10">
          <div className="text-center">
            <div className="text-gray-500 mb-2">🗺️</div>
            <p className="text-gray-600 font-medium">Search for mechanics to see them on the map</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

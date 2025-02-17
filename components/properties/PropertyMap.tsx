'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
const iconUrl =
  'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const markerIcon = icon({
  iconUrl: iconUrl,
  iconSize: [20, 30],
});

import Title from './Title';

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

function UpdateMapCenterAndZoom({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function PropertyMap({ address }: { address: string }) {
  const defaultLocation = [51.505, -0.09] as [number, number];
  const defaultZoom = 7;
  const detailedZoom = 18; // Higher zoom level for detailed view
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    (async () => {
      const coords = await geocodeAddress(address);
      setLocation(coords || defaultLocation);
    })();
  }, [address]);

  return (
    <div className='mt-4'>
      <div className='mb-4'>
        <Title text='Where you will be staying' />
      </div>
      <MapContainer
        scrollWheelZoom={false}
        zoomControl={false}
        className='h-[50vh] rounded-lg relative z-0'
        center={defaultLocation} // Initial render
        zoom={defaultZoom} // Default zoom level
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ZoomControl position='bottomright' />
        {location && (
          <>
            <UpdateMapCenterAndZoom center={location} zoom={detailedZoom} />
            <Marker position={location} icon={markerIcon}></Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default PropertyMap;

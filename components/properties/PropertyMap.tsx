// 'use client';

// import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import 'leaflet/dist/leaflet.css';
// import { icon } from 'leaflet';
// import Title from './Title';

// // ✅ Dynamically import react-leaflet components (fixes SSR issues)
// const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
// const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
// const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

// const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
// const markerIcon = icon({
//   iconUrl: iconUrl,
//   iconSize: [20, 30],
// });

// // Geocode Address Function
// async function geocodeAddress(address: string): Promise<[number, number] | null> {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data && data.length > 0) {
//       return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//     }
//   } catch (error) {
//     console.error('Geocoding error:', error);
//   }
//   return null;
// }

// function PropertyMap({ address }: { address: string }) {
//   const defaultLocation: [number, number] = [51.505, -0.09];
//   const defaultZoom = 7;
//   const detailedZoom = 18;
//   const [location, setLocation] = useState<[number, number] | null>(null);

//   useEffect(() => {
//     (async () => {
//       const coords = await geocodeAddress(address);
//       setLocation(coords || defaultLocation);
//     })();
//   }, [address]);

//   // Prevent rendering MapContainer until location is set
//   if (!location) {
//     return <div>Loading map...</div>;
//   }

//   return (
//     <div className='mt-4'>
//       <div className='mb-4'>
//         <Title text='Where you will be staying' />
//       </div>
//       <MapContainer
//         scrollWheelZoom={false}
//         zoomControl={false}
//         className='h-[50vh] rounded-lg relative z-0'
//         center={location}
//         zoom={detailedZoom}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//         />
//         <ZoomControl position='bottomright' />
//         <Marker position={location} icon={markerIcon} />
//       </MapContainer>
//     </div>
//   );
// }

// export default PropertyMap;

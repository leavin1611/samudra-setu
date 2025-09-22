'use client';

import { useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { HazardReport } from '@/lib/data';

export function MapWrapper({ reports }: { reports: HazardReport[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapLoaded = useRef(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAwNOYjQTLk42O-JpKHXGvxkraaMU8Oldc";

  useEffect(() => {

    const initMap = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 10.5, lng: 78.5 },
          zoom: 5,
          styles: [ 
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
            { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
          ]
        });

        reports.forEach(report => {
          new window.google.maps.Marker({
            position: { lat: report.lat, lng: report.lng },
            map: map,
            title: report.title,
          });
        });
        isMapLoaded.current = true;
      }
    };
    
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = () => {
        initMap();
      };
    } else {
      initMap();
    }
  }, [API_KEY, reports]);

  return (
      <Card className="w-full h-[600px] overflow-hidden shadow-lg relative">
        <div ref={mapRef} id="map" className="w-full h-full" />
        <div className="absolute top-4 right-4 z-10">
             <Card className="p-3">
                <div className="flex flex-col gap-2">
                    <Button variant="default">Heatmap View</Button>
                    <Button variant="outline">Cluster View</Button>
                </div>
            </Card>
        </div>
      </Card>
  );
}

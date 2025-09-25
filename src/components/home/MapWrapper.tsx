
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { HazardReport } from '@/lib/data';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type MapView = 'default' | 'heatmap' | 'cluster';

export function MapWrapper({ reports }: { reports: HazardReport[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const heatmapLayer = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markerClusterer = useRef<MarkerClusterer | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  
  const [mapView, setMapView] = useState<MapView>('default');

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const clearMap = () => {
    if (heatmapLayer.current) {
        heatmapLayer.current.setMap(null);
    }
    if (markerClusterer.current) {
        markerClusterer.current.clearMarkers();
    }
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
  };

  const showDefaultView = () => {
    if (!mapInstance.current) return;
    clearMap();
    markers.current = reports.map(report => 
      new window.google.maps.Marker({
        position: { lat: report.lat, lng: report.lng },
        map: mapInstance.current!,
        title: report.title,
      })
    );
  };

  const showHeatmapView = () => {
    if (!mapInstance.current || !window.google.maps.visualization) return;
    clearMap();
    const heatMapData = reports.map(report => new google.maps.LatLng(report.lat, report.lng));
    heatmapLayer.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: mapInstance.current,
    });
    heatmapLayer.current.set('radius', 20);
  };

  const showClusterView = () => {
    if (!mapInstance.current) return;
    clearMap();
    markers.current = reports.map(report => 
        new window.google.maps.Marker({
            position: { lat: report.lat, lng: report.lng },
            title: report.title,
        })
    );
    markerClusterer.current = new MarkerClusterer({ map: mapInstance.current, markers: markers.current });
  };
  
  useEffect(() => {
    const initMap = () => {
      if (window.google?.maps && mapRef.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
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
        showDefaultView();
      }
    };
    
    if (!window.google?.maps) {
      if (!API_KEY) {
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=visualization`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = () => {
        initMap();
      };
    } else {
      initMap();
    }
  }, [API_KEY]);

  useEffect(() => {
    if (!mapInstance.current) return;
    
    switch(mapView) {
      case 'heatmap':
        showHeatmapView();
        break;
      case 'cluster':
        showClusterView();
        break;
      case 'default':
      default:
        showDefaultView();
        break;
    }
  }, [mapView, reports, API_KEY]);

  return (
      <Card className="w-full h-[600px] overflow-hidden shadow-lg relative">
        <div ref={mapRef} id="map" className="w-full h-full" />
        <div className="absolute top-4 right-4 z-10">
             <Card className="p-3">
                <div className="flex flex-col gap-2">
                    <Button variant={mapView === 'default' ? 'default' : 'outline'} onClick={() => setMapView('default')}>Default View</Button>
                    <Button variant={mapView === 'heatmap' ? 'default' : 'outline'} onClick={() => setMapView('heatmap')}>Heatmap View</Button>
                    <Button variant={mapView === 'cluster' ? 'default' : 'outline'} onClick={() => setMapView('cluster')}>Cluster View</Button>
                </div>
            </Card>
        </div>
      </Card>
  );
}

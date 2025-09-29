
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type IoTDevice = {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'online' | 'offline' | 'warning';
  lastReading: Record<string, string>;
};

interface IoTDeviceContextType {
  devices: IoTDevice[];
  loading: boolean;
}

const IoTDeviceContext = createContext<IoTDeviceContextType | undefined>(undefined);

export const IoTDeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const response = await fetch('/iot-devices.json');
        if (!response.ok) {
          throw new Error('Failed to fetch IoT device data');
        }
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  return (
    <IoTDeviceContext.Provider value={{ devices, loading }}>
      {children}
    </IoTDeviceContext.Provider>
  );
};

export const useIoTDevices = () => {
  const context = useContext(IoTDeviceContext);
  if (context === undefined) {
    throw new Error('useIoTDevices must be used within an IoTDeviceProvider');
  }
  return context;
};

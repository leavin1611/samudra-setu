'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type NeedRequest = {
  id: string;
  user: string;
  timeAgo: string;
  needType: string;
  location: string;
  description: string;
  isUrgent: boolean;
  status: 'Open' | 'In-Progress' | 'Fulfilled';
};

interface NeedsContextType {
  needs: NeedRequest[];
  addNeed: (need: NeedRequest) => void;
  loading: boolean;
}

const NeedsContext = createContext<NeedsContextType | undefined>(undefined);

export const NeedsProvider = ({ children }: { children: ReactNode }) => {
  const [needs, setNeeds] = useState<NeedRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNeeds() {
      try {
        const response = await fetch('/needs-data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch needs data');
        }
        const data = await response.json();
        setNeeds(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchNeeds();
  }, []);

  const addNeed = (need: NeedRequest) => {
    setNeeds(prevNeeds => [need, ...prevNeeds]);
  };

  return (
    <NeedsContext.Provider value={{ needs, addNeed, loading }}>
      {children}
    </NeedsContext.Provider>
  );
};

export const useNeeds = () => {
  const context = useContext(NeedsContext);
  if (context === undefined) {
    throw new Error('useNeeds must be used within a NeedsProvider');
  }
  return context;
};

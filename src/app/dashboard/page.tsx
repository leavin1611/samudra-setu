
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Waves, LifeBuoy, SatelliteDish, LineChart, Database, Bell, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';

const dataMethods = [
  { icon: <Waves className="h-8 w-8 text-primary" />, title: 'Argo CTD Profiles' },
  { icon: <LifeBuoy className="h-8 w-8 text-primary" />, title: 'Buoy & AWS Data' },
  { icon: <SatelliteDish className="h-8 w-8 text-primary" />, title: 'Monitoring Station Data' },
  { icon: <LineChart className="h-8 w-8 text-primary" />, title: 'Other Profiles & Observations' },
];

const performanceMetrics = [
  { icon: <Database size={32} />, value: '98.7%', label: 'Data Uptime' },
  { icon: <Bell size={32} />, value: '12', label: 'Early Warnings' },
  { icon: <Clock size={32} />, value: '4.2min', label: 'Avg. Response Time' },
];

const contributionData = [
  { color: '#4e79a7', width: '10%', label: '10%' },
  { color: '#f28e2c', width: '15%', label: '15%' },
  { color: '#e15759', width: '20%', label: '20%' },
  { color: '#76b7b2', width: '25%', label: '25%' },
  { color: '#59a14f', width: '30%', label: '30%' },
];

const tableData = [
  { label: '10%', source: 'Argo CTD' },
  { label: '15%', source: 'Buoy Data' },
  { label: '20%', source: 'Station Data' },
  { label: '25%', source: 'Other Profiles' },
  { label: '30%', source: 'Satellite' },
  { label: '35%', source: 'Seismic' },
  { label: '40%', source: 'Tide Gauges' },
  { label: '45%', source: 'Other Sources' },
];

export default function ServicesDashboardPage() {
  const barSegmentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statNumbersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate percentage bar
    barSegmentsRef.current.forEach(segment => {
      if (segment) {
        const width = segment.style.width;
        segment.style.width = '0';
        setTimeout(() => {
          segment.style.transition = 'width 1.5s ease-in-out';
          segment.style.width = width;
        }, 500);
      }
    });

    // Animate stat numbers
    statNumbersRef.current.forEach(stat => {
      if (stat) {
        const originalText = stat.textContent || '';
        if (!isNaN(parseFloat(originalText))) {
          let counter = 0;
          const target = parseFloat(originalText);
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          const stepTime = duration / steps;
          
          const timer = setInterval(() => {
            counter += increment;
            stat.textContent = counter.toFixed(1);
            
            if (counter >= target) {
              stat.textContent = originalText;
              clearInterval(timer);
            }
          }, stepTime);
        }
      }
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Services & Operations (2023-24)</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          An overview of key services and operational statistics from the Tsunami Early Warning Centre
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Acquisition Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dataMethods.map((method, index) => (
                <div key={index} className="bg-background p-4 rounded-lg text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg border">
                  <div className="flex justify-center mb-2">{method.icon}</div>
                  <h3 className="font-semibold text-sm">{method.title}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-gradient-to-br from-primary to-[#357ABD] text-primary-foreground p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">{metric.icon}</div>
                  <div ref={el => statNumbersRef.current[index] = el} className="text-3xl font-bold">{metric.value}</div>
                  <p className="text-sm opacity-90">{metric.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contribution to Total Data Acquired (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="h-8 bg-muted rounded-full relative overflow-hidden flex my-10">
                {contributionData.map((item, index) => (
                  <div
                    key={index}
                    ref={el => barSegmentsRef.current[index] = el}
                    className="h-full"
                    style={{ width: item.width, background: item.color }}
                  ></div>
                ))}
              </div>
               <div className="flex justify-between text-muted-foreground text-sm -mt-6 mb-8">
                {contributionData.map((item, index) => (
                  <span key={index}>{item.label}</span>
                ))}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    {tableData.map((data, index) => (
                      <TableHead key={index} className="text-center">{data.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {tableData.map((data, index) => (
                       <TableCell key={index} className="text-center">{data.source}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

       <footer className="text-center mt-12 text-muted-foreground py-6">
            <p>Tsunami Early Warning Centre © 2023-24 | Providing critical early warnings for coastal safety</p>
        </footer>
    </div>
  );
}

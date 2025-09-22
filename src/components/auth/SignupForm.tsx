'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { User, Shield, Anchor, HeartHandshake } from 'lucide-react';

const userTypes = [
  { id: 'citizen', name: 'Citizen', desc: 'Report hazards & receive alerts', icon: <User /> },
  { id: 'coastal_resident', name: 'Coastal Resident', desc: 'Frequent observer near coast', icon: <Anchor /> },
  { id: 'volunteer', name: 'Volunteer', desc: 'Active contributor & helper', icon: <HeartHandshake /> },
  { id: 'disaster_manager', name: 'Disaster Manager', desc: 'Official/authorized personnel', icon: <Shield /> },
];

export function SignupForm() {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  const renderForm = () => {
    switch (selectedUserType) {
      case 'citizen':
        return <CitizenForm />;
      case 'coastal_resident':
        return <CoastalResidentForm />;
      case 'volunteer':
        return <VolunteerForm />;
      case 'disaster_manager':
        return <DisasterManagerForm />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center py-12 md:py-24">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create an Account</CardTitle>
          <CardDescription>Select your user type to continue with registration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {userTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedUserType(type.id)}
                className={cn(
                  'p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg',
                  selectedUserType === type.id ? 'border-primary bg-primary/10' : 'border-border'
                )}
              >
                <div className="flex justify-center mb-2 text-primary">{type.icon}</div>
                <h4 className="font-semibold">{type.name}</h4>
                <p className="text-xs text-muted-foreground">{type.desc}</p>
              </div>
            ))}
          </div>
          {renderForm()}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

const CitizenForm = () => (
  <form className="space-y-4 animate-in fade-in-50">
    <h3 className="text-xl font-semibold text-center mb-4">Citizen Registration</h3>
    <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Enter your full name" required /></div>
        <div className="space-y-2"><Label>Email Address *</Label><Input type="email" placeholder="Enter your email" required /></div>
        <div className="space-y-2"><Label>Mobile Number *</Label><Input type="tel" placeholder="Enter your mobile number" required /></div>
        <div className="space-y-2"><Label>Location (City/Town) *</Label><Input placeholder="Enter your location" required /></div>
        <div className="space-y-2"><Label>Username *</Label><Input placeholder="Choose a username" required /></div>
        <div className="space-y-2"><Label>Password *</Label><Input type="password" placeholder="Create a password" required /></div>
    </div>
    <div className="space-y-2 pt-4">
        <div className="flex items-center space-x-2"><Checkbox id="citizen-terms" required /><Label htmlFor="citizen-terms">I agree to the Terms of Service & Privacy Policy</Label></div>
        <div className="flex items-center space-x-2"><Checkbox id="citizen-data-consent" /><Label htmlFor="citizen-data-consent">Allow anonymized data for research</Label></div>
    </div>
    <Button className="w-full mt-4">Create Account</Button>
  </form>
);

const CoastalResidentForm = () => (
    <form className="space-y-4 animate-in fade-in-50">
    <h3 className="text-xl font-semibold text-center mb-4">Coastal Resident Registration</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Enter your full name" required /></div>
      <div className="space-y-2"><Label>Mobile Number *</Label><Input type="tel" placeholder="Enter your mobile number" required /></div>
      <div className="space-y-2 sm:col-span-2"><Label>Permanent Address *</Label><Textarea placeholder="Enter your complete address with pincode" required /></div>
      <div className="space-y-2"><Label>Nearest Coastal Landmark *</Label><Input placeholder="e.g., Marina Beach" required /></div>
      <div className="space-y-2"><Label>Knowledge Level *</Label>
        <Select required>
            <SelectTrigger><SelectValue placeholder="Select knowledge level" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="basic">Basic awareness</SelectItem>
                <SelectItem value="experienced">Experienced with coast</SelectItem>
                <SelectItem value="fisherfolk">Fisherfolk experience</SelectItem>
                <SelectItem value="trained">Response trained</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Username *</Label><Input placeholder="Choose a username" required /></div>
      <div className="space-y-2"><Label>Password *</Label><Input type="password" placeholder="Create a password" required /></div>
    </div>
    <div className="space-y-2 pt-4">
        <div className="flex items-center space-x-2"><Checkbox id="cr-terms" required /><Label htmlFor="cr-terms">I agree to the Terms of Service & Privacy Policy</Label></div>
    </div>
    <Button className="w-full mt-4">Create Account</Button>
  </form>
);

const VolunteerForm = () => (
    <form className="space-y-4 animate-in fade-in-50">
    <h3 className="text-xl font-semibold text-center mb-4">Volunteer Registration</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Enter your full name" required /></div>
      <div className="space-y-2"><Label>Email Address *</Label><Input type="email" placeholder="Enter your email" required /></div>
      <div className="space-y-2"><Label>Mobile Number *</Label><Input type="tel" placeholder="Enter your mobile number" required /></div>
      <div className="space-y-2"><Label>Current City *</Label><Input placeholder="Enter your current city" required /></div>
      <div className="space-y-2"><Label>Skills/Expertise *</Label>
          <Select required>
            <SelectTrigger><SelectValue placeholder="Select skills" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="first_aid">First Aid</SelectItem>
                <SelectItem value="water_rescue">Water Rescue</SelectItem>
                <SelectItem value="gis_mapping">GIS Mapping</SelectItem>
                <SelectItem value="community_org">Community Organization</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <div className="space-y-2"><Label>Affiliation (if any)</Label><Input placeholder="e.g., NGO, community group" /></div>
      <div className="space-y-2"><Label>Username *</Label><Input placeholder="Choose a username" required /></div>
      <div className="space-y-2"><Label>Password *</Label><Input type="password" placeholder="Create a password" required /></div>
    </div>
    <div className="space-y-2 pt-4">
        <div className="flex items-center space-x-2"><Checkbox id="vol-terms" required /><Label htmlFor="vol-terms">I agree to the Terms of Service & Privacy Policy</Label></div>
    </div>
    <Button className="w-full mt-4">Create Account</Button>
  </form>
);

const DisasterManagerForm = () => (
    <form className="space-y-4 animate-in fade-in-50">
    <h3 className="text-xl font-semibold text-center mb-4">Disaster Manager Registration</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Enter your full name" required /></div>
      <div className="space-y-2"><Label>Official Email *</Label><Input type="email" placeholder="Enter your official email" required /></div>
      <div className="space-y-2"><Label>Organization *</Label><Input placeholder="e.g., INCOIS, SDMA" required /></div>
      <div className="space-y-2"><Label>Designation *</Label><Input placeholder="Enter your designation" required /></div>
      <div className="space-y-2"><Label>Official ID Number *</Label><Input placeholder="Enter your official ID number" required /></div>
      <div className="space-y-2"><Label>ID Proof Document *</Label><Input type="file" required /></div>
      <div className="space-y-2"><Label>Username *</Label><Input placeholder="Choose a username" required /></div>
      <div className="space-y-2"><Label>Password *</Label><Input type="password" placeholder="Create a password" required /></div>
    </div>
    <div className="space-y-2 pt-4">
        <div className="flex items-center space-x-2"><Checkbox id="dm-terms" required /><Label htmlFor="dm-terms">I agree to the Terms of Service & Privacy Policy</Label></div>
    </div>
    <Button className="w-full mt-4">Submit for Verification</Button>
  </form>
);

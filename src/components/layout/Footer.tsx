import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-gray-400">
              An integrated platform for crowdsourced ocean hazard reporting and social media analytics.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/report" className="text-gray-400 hover:text-white transition-colors">Report Hazard</Link></li>
              <li><Link href="/#map" className="text-gray-400 hover:text-white transition-colors">Map View</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Alerts</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Safety Guidelines</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Community Forum</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@wavescope.in" className="text-gray-400 hover:text-white transition-colors">support@wavescope.in</a></li>
              <li><a href="tel:+919876543210" className="text-gray-400 hover:text-white transition-colors">+91 9876543210</a></li>
              <li className="text-gray-400">INCOIS, Hyderabad</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} WaveScope | Developed in collaboration with INCOIS</p>
        </div>
      </div>
    </footer>
  );
}

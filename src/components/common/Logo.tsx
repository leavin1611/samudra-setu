
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="SamudraSetu Home">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 38C10.0589 38 2 29.9411 2 20C2 10.0589 10.0589 2 20 2C29.9411 2 38 10.0589 38 20" stroke="url(#paint0_linear_1_2)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M20 2C29.9411 2 38 10.0589 38 20C38 29.9411 29.9411 38 20 38" stroke="url(#paint1_linear_1_2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
              <linearGradient id="paint0_linear_1_2" x1="2" y1="20" x2="38" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0.5"/>
              </linearGradient>
              <linearGradient id="paint1_linear_1_2" x1="38" y1="20" x2="2" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0.7"/>
              </linearGradient>
          </defs>
      </svg>
      <span className="text-xl font-bold text-white">SamudraSetu</span>
    </Link>
  );
}

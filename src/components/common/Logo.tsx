import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="OceanGuard Home">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="white"/>
          <path d="M28.0188 12.0375C25.4375 12.0375 22.9 13.025 21.05 14.875C18.4687 12.2938 14.6562 12.2938 12.075 14.875C9.49375 17.4562 9.49375 21.2687 12.075 23.85C14.6562 26.4312 18.4687 26.4312 21.05 23.85C22.9 25.7 25.4375 26.6875 28.0188 26.6875C28.9938 26.6875 29.9688 26.5 30.75 26.125V12.0375H28.0188Z" fill="#2563EB"/>
          <path d="M12.25 26.5C14.8313 26.5 17.3687 25.5125 19.2188 23.6625C21.7 26.2438 25.5125 26.2438 28.0938 23.6625C30.675 21.0812 30.675 17.2687 28.0938 14.6875C25.5125 12.1062 21.7 12.1062 19.2188 14.6875C17.3687 12.8375 14.8313 11.85 12.25 11.85C11.275 11.85 10.3 12.0375 9.5 12.4125V26.5H12.25Z" fill="url(#paint0_linear_1_2)"/>
          <defs>
              <linearGradient id="paint0_linear_1_2" x1="9.5" y1="19.175" x2="30.75" y2="19.175" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2563EB" stop-opacity="0.75"/>
                  <stop offset="1" stop-color="#2563EB" stop-opacity="0.25"/>
              </linearGradient>
          </defs>
      </svg>
      <span className="text-2xl font-bold text-white">OceanGuard</span>
    </Link>
  );
}

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="WaveScope Home">
      <svg width="40" height="40" viewBox="0 0 206 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M78.38 5.75c-14.74 0-28.53 6.9-38.03 18.9-3.8-3.99-9.1-6.25-14.73-6.25-11.5 0-20.82 9.32-20.82 20.82s9.32 20.82 20.82 20.82c5.63 0 10.93-2.26 14.73-6.25 9.5 12 23.29 18.9 38.03 18.9 29.28 0 52.99-23.7 52.99-52.99S107.66 5.75 78.38 5.75z" fill="#2563EB"/>
        <path d="M40.35 49.95c0-11.5-9.32-20.82-20.82-20.82-5.63 0-10.93 2.26-14.73 6.25C-4.7 25.88-14.2 18.9-28.94 18.9c-14.74 0-28.53 6.9-38.03 18.9C-70.27 41.1-73 45.4-73 50.04c0 4.63 2.73 8.94 6.03 12.24 9.5 12 23.29 18.9 38.03 18.9 14.74 0 28.53-6.9 38.03-18.9C19.83 54.58 25.6 49.95 40.35 49.95z" fill="url(#paint0_linear_1_2)"/>
        <defs>
          <linearGradient id="paint0_linear_1_2" x1="-73" y1="44.25" x2="40.35" y2="44.25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" stopOpacity="0.75"/>
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.5"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-2xl font-bold text-white">WaveScope</span>
    </Link>
  );
}

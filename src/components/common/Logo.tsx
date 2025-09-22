import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="OceanGuard Home">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="white"/>
        <path d="M7.5 10.8333L20 4.16667L32.5 10.8333V18.3333C32.5 26.5417 27.2917 33.9583 20 35.8333C12.7083 33.9583 7.5 26.5417 7.5 18.3333V10.8333Z" fill="#2563EB"/>
        <path d="M12.5 20C12.5 22.0711 14.1789 23.75 16.25 23.75C18.3211 23.75 20 22.0711 20 20C20 17.9289 18.3211 16.25 16.25 16.25C14.1789 16.25 12.5 17.9289 12.5 20Z" fill="white"/>
        <path d="M20 20C20 22.0711 21.6789 23.75 23.75 23.75C25.8211 23.75 27.5 22.0711 27.5 20C27.5 17.9289 25.8211 16.25 23.75 16.25C21.6789 16.25 20 17.9289 20 20Z" fill="white" fill-opacity="0.5"/>
      </svg>
      <span className="text-2xl font-bold text-white">OceanGuard</span>
    </Link>
  );
}
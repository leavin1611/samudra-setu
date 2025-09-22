
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="SamudraSetu Home">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="white" fillOpacity="0.1"/>
          <path d="M12 25C12 21.6667 14.6667 20 16 20C17.3333 20 20 21.6667 20 25C20 28.3333 22.6667 30 24 30C25.3333 30 28 28.3333 28 25C28 21.6667 25.3333 20 24 20C22.6667 20 20 18.3333 20 15C20 11.6667 17.3333 10 16 10C14.6667 10 12 11.6667 12 15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-xl font-bold text-white">SamudraSetu</span>
    </Link>
  );
}

type NavLink = {
    href: string;
    label: string;
  };
  
  export const links: NavLink[] = [
    { href: '/', label: 'home' },
    { href: '/favorites ', label: 'favorites' },
    { href: '/bookings ', label: 'bookings' },
    { href: '/reviews ', label: 'reviews' },
    { href: '/rentals/create ', label: 'create rental' },
    { href: '/rentals', label: 'my rentals' },
    { href: '/myairlines/create ', label: 'create airline' },
    { href: '/myairlines', label: 'my airlines' },
    { href: '/mytours/create ', label: 'create tour' },
    { href: '/mytours', label: 'my tours' },
    { href: '/profile ', label: 'profile' },
    { href: '/admin ', label: 'admin' },
  ];
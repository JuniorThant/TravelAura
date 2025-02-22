type NavLink = {
    href: string;
    label: string;
  };

 
  export const links: NavLink[] = [
    { href: '/favorites ', label: 'favorites' },
    { href: '/bookings ', label: 'bookings' },
  ];

  export const adminLinks: NavLink[] = [
    { href: '/admin ', label: 'admin' },
    { href: '/admin/verify ', label: 'verify services' },
  ];

  export const propertyLinks: NavLink[] = [
    { href: '/rentals ', label: 'my rentals' },
    { href: '/rentals/view ', label: 'property dashboard' },
  ];

  export const airlineLinks: NavLink[] = [
    { href: '/myairlines ', label: 'my airlines' },
    { href: '/myairlines/view ', label: 'airline dashboard' },
  ];

  export const tourLinks: NavLink[] = [
    { href: '/mytours ', label: 'my tours' },
    { href: '/mytours/view ', label: 'tour dashboard' },
  ];
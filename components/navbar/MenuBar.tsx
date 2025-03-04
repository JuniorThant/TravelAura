"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function MenuBar() {
  const pathname = usePathname() ?? ""; // ✅ Ensure pathname is always a string

  // Function to determine if the link is active
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex gap-5 p-4">
      <Link
        href="/"
        className={`${
          pathname === '/' || isActive('/properties') ? 'text-blue-500' : ''
        } hover:text-blue-500 transition duration-300`}
      >
        Properties
      </Link>
      <Link
        href="/airlines"
        className={`${isActive('/airlines') ? 'text-blue-500' : ''} hover:text-blue-500 transition duration-300`}
      >
        Airlines
      </Link>
      <Link
        href="/tours"
        className={`${isActive('/tours') ? 'text-blue-500' : ''} hover:text-blue-500 transition duration-300`}
      >
        Tours
      </Link>
    </div>
  );
}

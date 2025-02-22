import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LuAlignLeft } from 'react-icons/lu';
import Link from 'next/link';
import { Button } from '../ui/button';
import UserIcon from './UserIcon';
import { adminLinks, airlineLinks, links, propertyLinks, tourLinks } from '@/utils/links';
import SignOutLink from './SignOutLink';
import { SignedOut, SignedIn, SignInButton, SignUpButton } from '@clerk/nextjs';
import { getAuthUser, hasAirline, hasProperty, hasTour } from '@/utils/actions';
import { auth } from '@clerk/nextjs/server';

async function LinksDropdown() {
  const {userId}=auth()
  const propertyOwner=await hasProperty(userId)
  const airlineOwner=await hasAirline(userId)
  const tourOwner=await hasTour(userId)
  const admin=userId ===process.env.ADMIN_USER_ID
  if(!userId){
    return(
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex gap-4 max-w-[100px]'>
          <LuAlignLeft className='w-6 h-6' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-52' align='start' sideOffset={10}>
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode='modal'>
              <button className='w-full text-left'>Login</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignInButton mode='modal'>
              <button className='w-full text-left'>Register</button>
            </SignInButton>
          </DropdownMenuItem>
        </SignedOut>
        </DropdownMenuContent>
    </DropdownMenu>
    )
  }
  if(userId){
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex gap-4 max-w-[100px]'>
          <LuAlignLeft className='w-6 h-6' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-52' align='start' sideOffset={10}>
        <SignedIn>
        {admin && adminLinks.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='capitalize w-full'>
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        {propertyOwner && propertyLinks.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='capitalize w-full'>
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        {airlineOwner && airlineLinks.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='capitalize w-full'>
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        {tourOwner && tourLinks.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='capitalize w-full'>
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        {!(admin || propertyOwner || airlineOwner || tourOwner) && links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className='capitalize w-full'>
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
            <DropdownMenuItem key="registerproperties">
                <Link href="/rentals/create" className='capitalize w-full'>
                  register properties
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem key="registerairlines">
                <Link href="/myairlines/create" className='capitalize w-full'>
                  register airlines
                </Link>
              </DropdownMenuItem><DropdownMenuItem key="registertours">
                <Link href="/mytours/create" className='capitalize w-full'>
                  register tours
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem key="profile">
                <Link href="/profile" className='capitalize w-full'>
                  profile
                </Link>
              </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutLink />
        </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
}
export default LinksDropdown;

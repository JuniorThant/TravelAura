// BookingWrapper.ts

import { useRoom } from '@/utils/store';
import { Booking } from '@/utils/types';
import BookingCalendar from './BookingCalendar';
import BookingContainer from './BookingContainer';
import { useEffect } from 'react';



export default function BookingWrapper() {

  return (
    <div className='sticky top-0 bg-white'>
      <BookingCalendar/>
      <BookingContainer />
    </div>
  );
}

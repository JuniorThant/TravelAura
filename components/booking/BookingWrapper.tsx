
import BookingCalendar from './BookingCalendar';
import BookingContainer from './BookingContainer';




export default function BookingWrapper() {

  return (
    <div className='sticky top-0 bg-white'>
      <BookingCalendar/>
      <BookingContainer />
    </div>
  );
}

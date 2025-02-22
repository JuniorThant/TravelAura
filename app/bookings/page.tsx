import EmptyList from '@/components/home/EmptyList';
import Link from 'next/link';

import { formatDate, formatCurrency, formatDateTime } from '@/utils/format';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import FormContainer from '@/components/form/FormContainer';

import { deleteRoomBookingAction, fetchAirBookings, fetchRoomBookings, fetchTourBookings } from '@/utils/actions';
import { FaRegTrashAlt } from 'react-icons/fa';
import { SubmitButton } from '@/components/form/Button';

async function BookingsPage() {
    const roomBookings=await fetchRoomBookings();
    const airBookings=await fetchAirBookings()
    const tourBookings=await fetchTourBookings()
    if(roomBookings.length===0 && airBookings.length===0) return <EmptyList heading='No Bookings Now' message='You can explore our services and make bookings'/>
    return(
      <>
      {roomBookings.length>0 && <div className='mt-16'>
        <h4 className='mb-4 capitalize'>total bookings for stay : {roomBookings.length}</h4>
        <Table>
            <TableCaption>A list of your recent bookings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Property Name</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {roomBookings.map((roomBooking) => {
            const { id, orderTotal, totalNights, checkIn, checkOut } = roomBooking;
            const {  id:propertyId, name } = roomBooking.room.property;
            const {id:roomId,type}=roomBooking.room
            const startDate = formatDate(checkIn);
            const endDate = formatDate(checkOut);
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/properties/${propertyId}`}
                    className='underline text-muted-foreground tracking-wide'
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>
                  {type}
                </TableCell>
                <TableCell>{totalNights}</TableCell>
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell>
                  <DeleteBooking bookingId={id}/>
                </TableCell>
              </TableRow>
            );
          })}
            </TableBody>
        </Table>
      </div>}
      {airBookings.length>0 && <div className='mt-16'>
        <h4 className='mb-4 capitalize'>total air ticket bookings : {airBookings.length}</h4>
        <Table>
            <TableCaption>A list of your recent bookings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Airline Name</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Departure Airport</TableHead>
                <TableHead>Arrival Airport</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {airBookings.map((airBooking) => {
            const { id, orderTotal,passengers} = airBooking;
            const {  departureTime,arrivalTime,destinationAirport,originAirport,destination,origin } = airBooking.schedule
            const {  id:airlineId, name } = airBooking.schedule.airline
            const startDate = formatDateTime(departureTime);
            const endDate = formatDateTime(arrivalTime);
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/airlines/${airlineId}`}
                    className='underline text-muted-foreground tracking-wide'
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{passengers} Person</TableCell>
                <TableCell>
                {formatCurrency(orderTotal)}
                </TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell>{destinationAirport} <br/> ({destination})</TableCell>
                <TableCell>{originAirport} <br/> ({origin})</TableCell>
                <TableCell>
                  <DeleteBooking bookingId={id}/>
                </TableCell>
              </TableRow>
            );
          })}
            </TableBody>
        </Table>
      </div>}

      {tourBookings.length>0 && <div className='mt-16'>
        <h4 className='mb-4 capitalize'>total tour bookings : {tourBookings.length}</h4>
        <Table>
            <TableCaption>A list of your recent bookings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tour Name</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Departure Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {tourBookings.map((tourBooking) => {
            const { id, orderTotal,passengers} = tourBooking;
            const {  id:tourId,name:tourName,departureDate,arrivalDate } = tourBooking.package
            const startDate = formatDate(departureDate);
            const endDate = formatDate(arrivalDate);
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/airlines/${tourId}`}
                    className='underline text-muted-foreground tracking-wide'
                  >
                    {tourName}
                  </Link>
                </TableCell>
                <TableCell>{passengers} Person</TableCell>
                <TableCell>
                {formatCurrency(orderTotal)}
                </TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell>
                  <DeleteBooking bookingId={id}/>
                </TableCell>
              </TableRow>
            );
          })}
            </TableBody>
        </Table>
      </div>}
      </>
    )
  }

  function DeleteBooking({bookingId}:{bookingId:string}) {
    const deleteBooking=deleteRoomBookingAction.bind(null,{bookingId})
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className='bg-red-500'>Delete Booking</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This booking is non-refundable. Would you like to cancel the booking?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <FormContainer action={deleteBooking}>
                <AlertDialogAction type='submit' className="">Yes</AlertDialogAction>
            </FormContainer>
            <AlertDialogCancel>No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  export default BookingsPage;
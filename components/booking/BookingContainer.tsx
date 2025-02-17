// BookingContainer.tsx
"use client"
import { useAirlineBooking, useCalendar, useRoom } from "@/utils/store";
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";

export default function BookingContainer() {

  const {range}=useCalendar(state=>state)
  
  if (!range || !range.from) return null;
  
  // if (range.to.getTime() === range.from.getTime()) return null;

  return (
    <div className="w-full">
      <BookingForm />
      <ConfirmBooking />
    </div>
  );
}

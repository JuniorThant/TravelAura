// BookingContainer.tsx
"use client"
import {  useBool, useCalendar} from "@/utils/store";
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";

export default function BookingContainer() {

  const {range}=useCalendar(state=>state)
  const {boolRoom}=useBool((state)=>state)
  
  
  if(boolRoom){
    if (!range || !range.from || !range.to) return null;
    if (range.to.getTime() === range.from.getTime()) return null;
}

  return (
    <div className="w-full">
      <BookingForm />
      <ConfirmBooking />
    </div>
  );
}

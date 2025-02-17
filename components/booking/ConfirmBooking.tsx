'use client'

import { useAirline, useAirlineBooking, useRoom } from "@/utils/store"
import { SignInButton, useAuth } from "@clerk/nextjs"
import { Button } from "react-day-picker"
import FormContainer from "../form/FormContainer"
import { SubmitButton } from "../form/Button"
import { createAirlineBookingAction, createBookingAction } from "@/utils/actions"

export default function ConfirmBooking() {
    const {userId}=useAuth()
    const {roomId,range}=useRoom((state)=>state)
    const checkIn=range?.from as Date
    const checkOut=range?.to as Date
    const { scheduleIds, prices} = useAirlineBooking((state) => state);
    const {guests,flightClass}=useAirline((state)=>state)

    const priceOneWay = prices[0] || 0;
    const priceReturn = prices[1] || 0;
  
    if(!userId){
        return <SignInButton mode="modal">
            <Button type="button" className="w-full">
                Sign In to Complete Booking
            </Button>
        </SignInButton>
    }
    const createBookingAirline = createAirlineBookingAction.bind(null, { scheduleIds, prices, guests, flightClass: flightClass as string });
    const createBooking=createBookingAction.bind(null,{roomId,checkIn,checkOut})

    if(roomId){

        return (
          <section>
              <FormContainer action={createBooking}>
                  <SubmitButton text="Reserve Room" className="w-full"/>
              </FormContainer>
          </section>
        )
    }
    if (scheduleIds.length > 0) {
        return (
            <section>
                <FormContainer action={createBookingAirline}>
                    <SubmitButton text="Reserve Airline" className="w-full"/>
                </FormContainer>
            </section>
          )
    }
    return null
}

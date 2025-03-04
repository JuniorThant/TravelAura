import AmenitiesInput from '@/components/form/AmenitiesInput';
import { SubmitButton } from '@/components/form/Button';
import DatePickers from '@/components/form/DatePickers';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import PriceInput from '@/components/form/PriceInput';
import {  fetchScheduleDetails,  updateSchedule } from '@/utils/actions'
import { Amenity } from '@/utils/amenities';
import { redirect } from 'next/navigation'
import React from 'react'

export default async function EditAirlinePage({ params }: { params: { id: string; scheduleId: string } }) {
    
    const schedule=await fetchScheduleDetails(params.scheduleId) 
    if(!schedule) redirect('/')
      
    const defaultAmenities:Amenity[]=JSON.parse(schedule.amenities)
  return (
    <section>
        <h1 className='text-2xl font-semibold mb-8 capitalize'>Edit Property</h1>
        <div>
        <FormContainer action={updateSchedule}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="flightCode" type="text" label="Flight Code"  defaultValue={schedule.flightCode}/>
            <FormInput name="origin" type="text" label="Place of Departure" defaultValue={schedule.origin} />
            <FormInput name="destination" type="text" label="Place of Arrival" defaultValue={schedule.destination}/>
            <FormInput name="originAirport" type="text" label="Name of Departure Airport" defaultValue={schedule.originAirport}/>
            <FormInput name="destinationAirport" type="text" label="Name of Arrival Aiport" defaultValue={schedule.destinationAirport}/>
            <FormInput name="status" type="text" defaultValue={schedule.status} />
            <PriceInput defaultValue={schedule.price}/>
            <DatePickers 
  defaultDeparture={schedule.departureTime?.toISOString()} 
  defaultArrival={schedule.arrivalTime?.toISOString()} 
/>

          <FormInput name="economyCount" type="number" label="Total Passengers in Economy Class" defaultValue={schedule.economyCount} />
          <FormInput name="businessCount" type="number" label="Total Passengers in Business Class" defaultValue={schedule.businessCount}/>
          <FormInput name="firstClassCount" type="number" label="Total Passengers in First Class" defaultValue={schedule.firstClassCount}/>
          </div>
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput type="schedule" defaultValue={defaultAmenities}/>
          {/* Add a hidden input for the propertyId */}
          <input name="airlineId" type='hidden' value={schedule.airlineId} />
          <input name="scheduleId" type='hidden' value={params.scheduleId} />
          <SubmitButton text="Edit Schedule" className="mt-12" />
        </FormContainer>
        </div>
    </section>
  )
}

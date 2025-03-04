'use client'
import { useState } from 'react';
import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { SubmitButton } from '@/components/form/Button';
import AmenitiesInput from '@/components/form/AmenitiesInput';
import PriceInput from '@/components/form/PriceInput';
import { createScheduleAction } from '@/utils/actions';
import { usePathname, useRouter } from 'next/navigation';
import { DateTimePickerDemo } from '@/components/ui/datepicker';

export default function CreateSchedulePage() {
  const pathname = usePathname();
  const airlineId = pathname ? pathname.split('/')[2] : '';

  const [departureTime, setDepartureTime] = useState<Date | null>(new Date());
  const [arrivalTime, setArrivalTime] = useState<Date | null>(new Date());

  if (!airlineId) {
    return <p>Loading...</p>; // Or show a loading spinner, or error message
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Create Air Schedule
      </h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={createScheduleAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="flightCode" type="text" label="Flight Code" />
            <FormInput name="origin" type="text" label="Place of Departure" />
            <FormInput name="destination" type="text" label="Place of Arrival" />
            <FormInput name="originAirport" type="text" label="Name of Departure Airport" />
            <FormInput name="destinationAirport" type="text" label="Name of Arrival Aiport" />
            <input name="status" type="hidden" value="scheduled" />
            <PriceInput />
            <DateTimePickerDemo label="Date and Time of Departure" value={departureTime} onChange={setDepartureTime} />
            <DateTimePickerDemo label="Date and Time of Arrival" value={arrivalTime} onChange={setArrivalTime} />
          <FormInput name="economyCount" type="number" label="Total Passengers in Economy Class" />
          <FormInput name="businessCount" type="number" label="Total Passengers in Business Class" />
          <FormInput name="firstClassCount" type="number" label="Total Passengers in First Class" />
          </div>
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput type="schedule" />
          {/* Add a hidden input for the propertyId */}
          <input name="airlineId" value={airlineId} />
          <input name="departureTime" type="hidden" value={departureTime?.toISOString()} />
          <input name="arrivalTime" type="hidden" value={arrivalTime?.toISOString()} />
          <SubmitButton text="Create Schedule" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

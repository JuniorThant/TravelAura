'use client'
import { useState } from 'react';
import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { SubmitButton } from '@/components/form/Button';
import TextAreaInput from '@/components/form/TextAreaInput';
import ImageInput from '@/components/form/ImageInput';
import PriceInput from '@/components/form/PriceInput';
import { createPackageAction } from '@/utils/actions';
import { usePathname } from 'next/navigation';
import { DatePickerDemo } from '@/components/ui/datapickerdemo';

export default function CreatePackagePage() {
  const pathname = usePathname();
  const tourId = pathname ? pathname.split('/')[2] : '';

  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);

  if (!tourId) {
    return <p>Loading...</p>; // Or show a loading spinner, or error message
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Create Tour Package
      </h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={createPackageAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="name" type="text" label="Package Name" />
            <FormInput name="maxGuests" type="number" label="Total Numbers of Guests" />
            <PriceInput />
            <ImageInput name="image" />
            <DatePickerDemo label="Departure Date" value={departureDate} onChange={setDepartureDate} />
            <DatePickerDemo label="Arrival Date" value={arrivalDate} onChange={setArrivalDate} />
          </div>
          <TextAreaInput name="description" rows={3} />
          <TextAreaInput name="itinerary" labelText="Itinerary Details" rows={3} />
          
          {/* Hidden Inputs for Date Values */}
          <input name="tourId" value={tourId} type="hidden" />
          <input name="departureDate" type="hidden" value={departureDate?.toISOString()} />
          <input name="arrivalDate" type="hidden" value={arrivalDate?.toISOString()} />

          <SubmitButton text="Create Package" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

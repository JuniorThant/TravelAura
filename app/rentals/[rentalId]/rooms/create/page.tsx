"use client"
import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { SubmitButton } from '@/components/form/Button';
import AmenitiesInput from '@/components/form/AmenitiesInput';
import ImageInput from '@/components/form/ImageInput';
import PriceInput from '@/components/form/PriceInput';
import { createRoomAction } from '@/utils/actions';
import { usePathname } from 'next/navigation';

export default function CreateRoomPage() {
  const pathname=usePathname() 
  if (!pathname) {
    return <p>Loading...</p>; // Handle null case properly
  }
  const propertyId = pathname.split('/')[2];

  if (!propertyId) {
    return <p>Loading...</p>; // Or show a loading spinner, or error message
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Create Room
      </h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <FormContainer action={createRoomAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="type" type="text" label="Room Type " />
            <FormInput name="quantity" type="number" label="Room Quantity " />
            <FormInput name="guests" type="number" label="Guests Quantity " />
            <FormInput name="beds" type="text" label="Beds " />
            <FormInput name="view" type="text" label="View " />
            <PriceInput />
            <ImageInput name='image'/>
          </div>
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput type='room'/>
          {/* Add a hidden input for the propertyId */}
          <input name="propertyId" type='hidden' value={propertyId} />
          <SubmitButton text="Create Room" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

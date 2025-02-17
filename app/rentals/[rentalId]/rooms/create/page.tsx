"use client"
import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { SubmitButton } from '@/components/form/Button';
import TextAreaInput from '@/components/form/TextAreaInput';
import AmenitiesInput from '@/components/form/AmenitiesInput';
import ImageInput from '@/components/form/ImageInput';
import PriceInput from '@/components/form/PriceInput';
import { createRoomAction } from '@/utils/actions';
import { usePathname, useRouter } from 'next/navigation';

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
            <FormInput name="type" type="text" label="Room Type (20 limit)" />
            <FormInput name="quantity" type="number" label="Room Quantity (30 limit)" />
            <FormInput name="guests" type="number" label="Guests Quantity (30 limit)" />
            <FormInput name="beds" type="text" label="Beds (30 limit)" />
            <FormInput name="view" type="text" label="View (30 limit)" />
            <PriceInput />
            <ImageInput name='image'/>
          </div>
          <TextAreaInput name="description" labelText="Description (10 - 1000 words)" />
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput type='room'/>
          {/* Add a hidden input for the propertyId */}
          <input name="propertyId" value={propertyId} />
          <SubmitButton text="Create Room" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

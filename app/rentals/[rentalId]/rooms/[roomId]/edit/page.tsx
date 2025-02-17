import AmenitiesInput from '@/components/form/AmenitiesInput';
import { SubmitButton } from '@/components/form/Button';
import CategoriesInput from '@/components/form/CategoriesInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInputContainer from '@/components/form/ImageInputContainer'
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { fetchRoomDetails, updateRoomAction, updateRoomImageAction } from '@/utils/actions'
import { Amenity } from '@/utils/amenities';
import { redirect } from 'next/navigation'
import { stringify } from 'querystring';
import React from 'react'

export default async function EditRentalPage({ params }: { params: { rentalId: string; roomId: string } }) {
    const room=await fetchRoomDetails(params.roomId)
    if(!room) redirect('/')
    const defaultAmenities:Amenity[]=JSON.parse(room.amenities)
  return (
    <section>
        <h1 className='text-2xl font-semibold mb-8 capitalize'>Edit Property</h1>
        <div>
            <ImageInputContainer
            name={room.type}
            text='Update Image'
            action={updateRoomImageAction}
            image={room.image} >
                <input type='hidden' name='id' value={room.id}/>
                <input type='hidden' name='pid' value={room.propertyId}/>
            </ImageInputContainer>
            <FormContainer action={updateRoomAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="type" type="text" label="Room Type (20 limit)" defaultValue={room.type}/>
            <FormInput name="quantity" type="number" label="Room Quantity (30 limit)" defaultValue={room.quantity}/>
            <FormInput name="guests" type="number" label="Guests Quantity (30 limit)" defaultValue={room.guests}/>
            <FormInput name="beds" type="text" label="Beds (30 limit)" defaultValue={room.beds}/>
            <FormInput name="view" type="text" label="View (30 limit)" defaultValue={room.view}/>
            <PriceInput defaultValue={room.price}/>
          </div>
          <TextAreaInput name="description" labelText="Description (10 - 1000 words)" defaultValue={room.description}/>
          <input name='roomId' type='hidden' value={room.id}/>
          <input name='propertyId' type='hidden' value={room.propertyId}/>
          <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
          <AmenitiesInput type='room' defaultValue={defaultAmenities}/>
          <SubmitButton text="Edit Room" className="mt-12" />
        </FormContainer>
        </div>
    </section>
  )
}

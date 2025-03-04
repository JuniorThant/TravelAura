import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createPropertyAction, fetchPropertyDetails, updatePropertyAction, updatePropertyImageAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Button';
import CategoriesInput from '@/components/form/CategoriesInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import AmenitiesInput from '@/components/form/AmenitiesInput';
import ImageInput from '@/components/form/ImageInput';
import FileInput from '@/components/form/FileInput';
import { Amenity } from '@/utils/amenities';
import { redirect } from 'next/navigation';
import ImageInputContainer from '@/components/form/ImageInputContainer';

export default async function EditPropertyPage({params}:{params:{rentalId:string}}) {
    const property= await fetchPropertyDetails(params.rentalId)
    if(!property) redirect('/rentals')
    const defaultAmenities:Amenity[]=JSON.parse(property.amenities)
  return <section>
        <h1 className="text-2xl font-semibold mb-8 capitalize">
            edit property details
        </h1>
        <div className="border p-8 rounded">
            <h3 className="text-lg mb-4 font-medium">General Info</h3>
            <ImageInputContainer
            name={property.name}
            text='Update Image'
            action={updatePropertyImageAction}
            image={property.image} >
                <input type='hidden' name='pid' value={property.id}/>
            </ImageInputContainer>
            <FormContainer action={updatePropertyAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
              defaultValue={property.name}
            />
            <FormInput
              name='tagline'
              type='text '
              label='Tagline (30 limit)'
              defaultValue={property.tagline}
            />
            <CategoriesInput defaultValue={property.category}/>
          </div>
          <TextAreaInput name='address' labelText='Address (10 - 100 words)' rows={2} defaultValue={property.address}/>
          <TextAreaInput name='description' labelText='Description (10 - 1000 words)' defaultValue={property.description}/>
          <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
          <AmenitiesInput type='property' defaultValue={defaultAmenities}/>
          <input name='propertyId' type='hidden' value={params.rentalId}/>
          <SubmitButton text='update' className='mt-12' />
        </FormContainer>
        </div>
    </section>
  
}

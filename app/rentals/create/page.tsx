import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createPropertyAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Button';
import CategoriesInput from '@/components/form/CategoriesInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import AmenitiesInput from '@/components/form/AmenitiesInput';
import ImageInput from '@/components/form/ImageInput';
import FileInput from '@/components/form/FileInput';

export default function CreatePropertyPage() {
  return <section>
        <h1 className="text-2xl font-semibold mb-8 capitalize">
            register property
        </h1>
        <div className="border p-8 rounded">
            <h3 className="text-lg mb-4 font-medium">General Info</h3>
            <FormContainer action={createPropertyAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
            />
            <FormInput
              name='tagline'
              type='text '
              label='Tagline (30 limit)'
            />
            <CategoriesInput/>
            <ImageInput name='image'/>
            <FileInput name='file' label='Upload Your Company License and Documents (PDF Format Only)'/>
          </div>
          <TextAreaInput name='address' labelText='Address (10 - 100 words)' rows={2}/>
          <TextAreaInput name='description' labelText='Description (10 - 1000 words)'/>
          <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
          <AmenitiesInput type='property'/>
          <SubmitButton text='create rental' className='mt-12' />
        </FormContainer>
        </div>
    </section>
  
}

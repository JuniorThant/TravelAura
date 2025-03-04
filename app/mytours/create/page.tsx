import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createAirlineAction, createTourAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Button';
import TextAreaInput from '@/components/form/TextAreaInput';
import ImageInput from '@/components/form/ImageInput';
import FileInput from '@/components/form/FileInput';

export default function CreateTourPage() {
  return <section>
        <h1 className="text-2xl font-semibold mb-8 capitalize">
            create tour
        </h1>
        <div className="border p-8 rounded">
            <h3 className="text-lg mb-4 font-medium">General Info</h3>
            <FormContainer action={createTourAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='name'
              type='text'
              label='Name'
            />
            <FormInput
              name='tagline'
              type='text '
              label='Tagline'
            />
            <ImageInput name='image'/>
            <FileInput name='file' label='Upload you company license and documents (Only in PDF Format)'/>
          </div>
          <TextAreaInput name='address' labelText='Address' rows={2}/>
          <TextAreaInput name='description' labelText='Description'/>
          <SubmitButton text='create tour' className='mt-12' />
        </FormContainer>
        </div>
    </section>
  
}


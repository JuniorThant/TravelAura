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
              label='Name (20 limit)'
            />
            <FormInput
              name='tagline'
              type='text '
              label='Tagline (30 limit)'
            />
            <ImageInput name='image'/>
            <FileInput name='file'/>
          </div>
          <TextAreaInput name='address' labelText='Address (10 - 100 words)' rows={2}/>
          <TextAreaInput name='description' labelText='Description (10 - 1000 words)'/>
          <SubmitButton text='create tour' className='mt-12' />
        </FormContainer>
        </div>
    </section>
  
}


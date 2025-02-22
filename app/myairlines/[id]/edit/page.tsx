import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createAirlineAction, fetchAirlineDetails, updateAirlineAction, updateAirlineImageAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Button';
import TextAreaInput from '@/components/form/TextAreaInput';
import ImageInput from '@/components/form/ImageInput';
import FileInput from '@/components/form/FileInput';
import { redirect } from 'next/navigation';
import ImageInputContainer from '@/components/form/ImageInputContainer';

export default async function EditAirlinePage({params}:{params:{id:string}}) {
    const airline=await fetchAirlineDetails(params.id)
    if(!airline) redirect ('/myairlines')
  return <section>
        <h1 className="text-2xl font-semibold mb-8 capitalize">
            edit airline details
        </h1>
        <div className="border p-8 rounded">
            <h3 className="text-lg mb-4 font-medium">General Info</h3>
            <ImageInputContainer
            name={airline.name}
            text='Update Image'
            action={updateAirlineImageAction}
            image={airline.image} >
                <input type='hidden' name='airlineId' value={airline.id}/>
            </ImageInputContainer>
            <ImageInputContainer
            name={airline.name}
            isLogo
            text='Update Logo'
            action={updateAirlineImageAction}
            image={airline.logo} >
                <input type='hidden' name='airlineId' value={airline.id}/>
            </ImageInputContainer>
            <FormContainer action={updateAirlineAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
              defaultValue={airline.name}
            />
            <FormInput
              name='tagline'
              type='text '
              label='Tagline (30 limit)'
              defaultValue={airline.tagline}
            />
          </div>
          <TextAreaInput name='description' labelText='Description (10 - 1000 words)' defaultValue={airline.description} />
          <input name='airlineId' value={airline.id}/>
          <SubmitButton text='edit airline' className='mt-12' />
        </FormContainer>
        </div>
    </section>
  
}


import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { SubmitButton } from '@/components/form/Button';
import TextAreaInput from '@/components/form/TextAreaInput';
import PriceInput from '@/components/form/PriceInput';
import { fetchPackageDetails, updatePackageAction, updatePackageImageAction } from '@/utils/actions';
import DatePickers from '@/components/form/DatePickers';
import ImageInputContainer from '@/components/form/ImageInputContainer';

export default async function EditPackagePage({ params }: { params: { id: string; packageId: string } }) {

    const pkg=await fetchPackageDetails(params.packageId)
    if(!pkg) return null

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        Edit Tour Package
      </h1>
      <div className="border p-8 rounded">
        <h3 className="text-lg mb-4 font-medium">General Info</h3>
        <ImageInputContainer
            name={pkg.name}
            text='Update Image'
            action={updatePackageImageAction}
            image={pkg.image} >
                <input type='hidden' name='id' value={pkg.id}/>
                <input type='hidden' name='tid' value={pkg.tourId}/>
            </ImageInputContainer>
        <FormContainer action={updatePackageAction}>
          <div className="grid md:grid-cols-2 gap-8 mb-4">
            <FormInput name="name" type="text" label="Package Name" defaultValue={pkg.name}/>
            <FormInput name="maxGuests" type="number" label="Total Numbers of Guests" defaultValue={pkg.maxGuests}/>
            <PriceInput defaultValue={pkg.price}/>
            <DatePickers 
                defaultDeparture={pkg.departureDate?.toISOString()} 
                defaultArrival={pkg.arrivalDate?.toISOString()} onlyDate={true}
                />
          </div>
          <TextAreaInput name="description" rows={5} defaultValue={pkg.description}/>
          <TextAreaInput name="itinerary" labelText="Itinerary Details" rows={5} defaultValue={pkg.itinerary}/>
          
          {/* Hidden Inputs for Date Values */}
          <input name="tourId" value={pkg.tourId} type="hidden" />
          <input name="packageId" value={pkg.id} type="hidden" />
          <SubmitButton text="Edit Package" className="mt-12" />
        </FormContainer>
      </div>
    </section>
  );
}

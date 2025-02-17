import BookingWrapper from "@/components/booking/BookingWrapper";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import PropertyRating from "@/components/card/ItemRating";
import Amenities from "@/components/properties/Amenities";
import BreadCrumb from "@/components/properties/BreadCrumb";
import Description from "@/components/properties/Description";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyMap from "@/components/properties/PropertyMap";
import Rooms from "@/components/properties/Rooms";
import { fetchPropertyDetails } from "@/utils/actions";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { redirect } from "next/navigation";


export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  // Await the params before accessing it
  const propertyId = params.id;

  // Fetch property details using the awaited propertyId
  const property = await fetchPropertyDetails(propertyId);

  // Redirect if no property is found
  if (!property) redirect("/");

  const { name, address, description, tagline, image, amenities } = property;

  return (
    <>
      <section>
        <BreadCrumb name={name} />
        <header className="flex justify-between items-center mt-4">
          <h1 className="text-4xl font-bold capitalize">{tagline}</h1>
          <div className="flex items-center gap-x-4">
            <FavoriteToggleButton itemId={property.id} itemType="property" />
          </div>
        </header>
        <ImageContainer mainImage={image} name={name} />
      </section>
      <section>
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{name}</h1>
            <PropertyRating inPage itemId={property.id} itemType="property"/>
          </div>
          <Separator className="mt-8" />
          <Description description={description} />
          <Amenities amenities={amenities} text='The amenities of this hotel include:'/>
          <PropertyMap address={address} />
      </section>
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
      <div className="lg:col-span-8">
        <Rooms propertyId={property.id} /> 
      </div>
      <div className="lg:col-span-4">
      <BookingWrapper />
      </div> 
      </section>
    </>
  );
}

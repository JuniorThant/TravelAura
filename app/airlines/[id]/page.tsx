import Schedules from "@/components/airlines/Schedules";
import BookingWrapper from "@/components/booking/BookingWrapper";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import ItemRating from "@/components/card/ItemRating";
import BreadCrumb from "@/components/properties/BreadCrumb";
import Description from "@/components/properties/Description";
import ImageContainer from "@/components/properties/ImageContainer";
import { fetchAirlineDetails, fetchPropertyDetails } from "@/utils/actions";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { redirect } from "next/navigation";


export default async function AirlineDetailsPage({ params }: { params: { id: string } }) {
  // Await the params before accessing it
  const airlineId = params.id;

  // Fetch property details using the awaited airlineId
  const airline = await fetchAirlineDetails(airlineId);

  // Redirect if no airline is found
  if (!airline) redirect("/");

  const { name, description, tagline, image } = airline;

  return (
    <>
      <section>
        <BreadCrumb name={name} />
        <header className="flex justify-between items-center mt-4">
          <h1 className="text-4xl font-bold capitalize">{tagline}</h1>
          <div className="flex items-center gap-x-4">
            <FavoriteToggleButton itemId={airline.id} itemType="property" />
          </div>
        </header>
        <ImageContainer mainImage={image} name={name} />
      </section>
      <section>
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{name}</h1>
            <ItemRating inPage itemId={airline.id} itemType="airline"/>
          </div>
          <Separator className="mt-8" />
          <Description description={description} />
      </section>
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
      <div className="lg:col-span-8">
        <Schedules airlineId={airlineId}/>
      </div>
      <div className="lg:col-span-4">
      <BookingWrapper />
      </div> 
      </section>
    </>
  );
}

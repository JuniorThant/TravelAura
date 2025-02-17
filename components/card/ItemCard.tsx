import Image from "next/image";
import Link from "next/link";
import PropertyRating from "./ItemRating";
import FavoriteToggleButton from "./FavoriteToggleButton";
import { ItemCardProps } from "@/utils/types";
import ItemRating from "./ItemRating";

export default function ItemCard({ item, pathname }: { item: ItemCardProps, pathname?: string }) {
  const { id, name, image, tagline, type } = item;

  // Determine the appropriate link based on the item type
  const itemLink = `/${type === "property" ? "properties" : type === "airline" ? "airlines" : "tours"}/${id}`;

  // Function to render the "Create" button based on pathname
  const renderCreateButton = () => {
    if (pathname === "/rentals") {
      return <Link href={`/rentals/${id}/rooms/create`}>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded">Create Room</button>
    </Link>;
    } else if (pathname === "/myairlines") {
      return <Link href={`/myairlines/${id}/schedules/create`}>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded">Create Airline Schedule</button>
    </Link>;;
    } else if (pathname === "/mytours") {
      return <button className="mt-2 p-2 bg-blue-500 text-white rounded">Create Tour Schedule</button>;
    } else {
      return (<>
    <p className="text-sm mt-1 text-muted-foreground">
      {tagline?.substring(0, 40)}
    </p></>)  // Return nothing if the pathname doesn't match any of the above
    }
  };

  return (
    <article className="group relative">
      <Link href={itemLink}>
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md border border-outline">
          <Image
            src={image}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            alt={name}
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1">
            {name.substring(0, 30)}
          </h3>
          {type === "property" && (
            <ItemRating inPage={false} itemId={id} itemType="property" />
          )}
        </div>
        {renderCreateButton()}
      </Link>
      <div className="absolute top-5 right-5 z-5">
        <FavoriteToggleButton itemId={id} itemType={type} />
      </div>
    </article>
  );
}

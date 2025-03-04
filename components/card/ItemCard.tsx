import Image from "next/image";
import Link from "next/link";
import FavoriteToggleButton from "./FavoriteToggleButton";
import { ItemCardProps } from "@/utils/types";
import { fetchLowestPrice } from "@/utils/actions";

export default async function ItemCard({ item, pathname }: { item: ItemCardProps, pathname?: string }) {
  const { id, name, image, tagline, type } = item;
  const itemLink = `/${type === "property" ? "properties" : type === "airline" ? "airlines" : "tours"}/${id}`;
  const lowestPrice=await fetchLowestPrice(id,type)

  const renderCreateButton = () => {
    if (pathname === "/rentals") {
      return (<>
        <Link href={`/rentals/${id}/edit`}>
          <button className="mt-2 p-2 m-2 bg-blue-500 text-white rounded">Edit Property</button>
        </Link>
        <Link href={`/rentals/${id}/rooms/create`}>
        <button className="mt-2 p-2 m-2 bg-blue-500 text-white rounded">Create Room</button>
      </Link>
      </>
      );
    } else if (pathname === "/myairlines") {
      return (<>
        <Link href={`/myairlines/${id}/edit`}>
          <button className="mt-2 m-2 p-2 ml-3 bg-blue-500 text-white rounded">Edit Airline</button>
        </Link>
        <Link href={`/myairlines/${id}/schedules/create`}>
          <button className="mt-2 m-2 p-2 bg-blue-500 text-white rounded">Create Schedule</button>
        </Link>
        </>
      );
    } else if (pathname === "/mytours") {
      return (<>
      <Link href={`/mytours/${id}/edit`}>
          <button className="mt-2 m-2 p-2 ml-3 bg-blue-500 text-white rounded">Edit Tour</button>
        </Link>
        <Link href={`/mytours/${id}/packages/create`}>
          <button className="mt-2 p-2 bg-blue-500 text-white rounded">Create Package</button>
        </Link>
        </>
      );
    } else {
      return <p className="text-sm mt-1 text-muted-foreground">{tagline?.substring(0, 40)}</p>;
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
      </Link>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold mt-1">
          <Link href={itemLink}>{name}</Link>
        </h3>
        <h6 className="text-xs font-semibold w-[150px] text-right">Starts from {lowestPrice}</h6>
      </div>
      {/* Move Create Button outside of the main Link */}
      {renderCreateButton()}
      <div className="absolute top-5 right-5 z-5">
        <FavoriteToggleButton itemId={id} itemType={type} />
      </div>
    </article>
  );
}


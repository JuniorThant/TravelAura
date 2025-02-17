import React from "react";
import { FaStar } from "react-icons/fa6";

export default function ItemRating({
  itemId,
  itemType,
  inPage,
}: {
  itemId: string;
  itemType: "property" | "airline" | "tour";
  inPage: boolean;
}) {
  const rating = 4.7; // Example rating value (can be fetched based on itemId and itemType)
  const count = 100; // Example review count

  const className = `flex gap-1 items-center ${inPage ? "text-md" : "text-xs"}`;
  const countText = count > 1 ? "reviews" : "review";
  const countValue = `(${count}) ${inPage ? countText : ""}`;
  
  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {rating} {countValue}
    </span>
  );
}

import { FaHeart } from "react-icons/fa6";
import { Button } from "../ui/button";
import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Button";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

type FavoriteToggleButtonProps = {
  itemId: string; 
  itemType: "property" | "airline" | "tour"; 
};

export default async function FavoriteToggleButton({
  itemId,
  itemType,
}: FavoriteToggleButtonProps) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ itemId, itemType })
  
  return <FavoriteToggleForm favoriteId={favoriteId} itemId={itemId} itemType={itemType}/>
}

import EmptyList from "@/components/home/EmptyList";
import ItemsList from "@/components/home/ItemsList";
import { fetchFavorites } from "@/utils/actions";

async function FavoritesPage() {

    const favorites=await fetchFavorites()
    
    if(favorites.length===0){
      return <EmptyList/>
    }

    return <ItemsList items={favorites}/>;
  }
  export default FavoritesPage;
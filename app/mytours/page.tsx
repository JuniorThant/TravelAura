import EmptyList from "@/components/home/EmptyList";
import ItemsList from "@/components/home/ItemsList";
import { fetchMyTours } from "@/utils/actions";

async function MyToursPage() {
    const { tours, pathname } = await fetchMyTours(); // Destructure the returned object

    if (tours.length === 0) {
        return <EmptyList />;
    }

    return <ItemsList items={tours} pathname={pathname} />; // Pass pathname to ItemsList
}

export default MyToursPage;

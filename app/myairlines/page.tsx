import EmptyList from "@/components/home/EmptyList";
import ItemsList from "@/components/home/ItemsList";
import { fetchMyAirlines } from "@/utils/actions";

async function MyAirlinesPage() {
    const { airlines, pathname } = await fetchMyAirlines(); // Destructure the returned object

    if (airlines.length === 0) {
        return <EmptyList />;
    }

    return <ItemsList items={airlines} pathname={pathname} />; // Pass pathname to ItemsList
}

export default MyAirlinesPage;

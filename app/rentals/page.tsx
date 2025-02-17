import EmptyList from "@/components/home/EmptyList";
import ItemsList from "@/components/home/ItemsList";
import { fetchMyProperties } from "@/utils/actions";

async function RentalsPage() {
    const { properties, pathname } = await fetchMyProperties(); // Destructure the returned object

    if (properties.length === 0) {
        return <EmptyList />;
    }

    return <ItemsList items={properties} pathname={pathname} />; // Pass pathname to ItemsList
}

export default RentalsPage;

import LoadingCards from "@/components/card/LoadingCards";
import ItemsContainer from "@/components/home/ItemsContainer";
import { fetchTours } from "@/utils/actions";
import { Suspense } from "react";

export default async function ToursPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const tours = await fetchTours({ search: searchParams.search });

  return (
    <section>
      <Suspense fallback={<LoadingCards />}>
        <ItemsContainer items={tours} />
      </Suspense>
    </section>
  );
}

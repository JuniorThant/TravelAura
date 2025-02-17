import LoadingCards from "@/components/card/LoadingCards";
import ItemsContainer from "@/components/home/ItemsContainer";
import { fetchAirlines } from "@/utils/actions";
import { Suspense } from "react";

export default async function AirlinesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const airlines = await fetchAirlines({ search: searchParams.search });

  return (
    <section>
      <Suspense fallback={<LoadingCards />}>
        <ItemsContainer items={airlines} />
      </Suspense>
    </section>
  );
}

import LoadingCards from "@/components/card/LoadingCards";
import ItemsContainer from "@/components/home/ItemsContainer";
import { fetchProperties } from "@/utils/actions";
import { Suspense } from "react";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const properties = await fetchProperties({ search: searchParams.search });

  return (
    <section>
      <Suspense fallback={<LoadingCards />}>
        <ItemsContainer items={properties} />
      </Suspense>
    </section>
  );
}

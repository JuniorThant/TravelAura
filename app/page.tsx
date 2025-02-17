
import LoadingCards from "@/components/card/LoadingCards";
import ItemsContainer from "@/components/home/ItemsContainer";
import { fetchProperties } from "@/utils/actions";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  // Ensure safe handling of `searchParams.search`
  const search = searchParams?.search || "";

  const properties = await fetchProperties({ search });


  return (
    <section>
      <Suspense fallback={<LoadingCards />}>
        <ItemsContainer items={properties} />
      </Suspense>
    </section>
  );
}

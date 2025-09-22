import LoadingCards from "@/components/card/LoadingCards";
import ItemsContainer from "@/components/home/ItemsContainer";
import { fetchProperties } from "@/utils/actions";
import { Suspense } from "react";
import { headers } from "next/headers";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  // Await searchParams to handle it safely
  const params = await searchParams;
  const search = params?.search || "";

  // Example: if you need headers for anything
  const allHeaders = await headers();
  const csp = allHeaders.get("Content-Security-Policy"); // optional

  const properties = await fetchProperties({ search });

  return (
    <section>
      <Suspense fallback={<LoadingCards />}>
        <ItemsContainer items={properties} />
      </Suspense>
    </section>
  );
}

import ItemCard from '../card/ItemCard';
import type { ItemCardProps } from '@/utils/types';

export default function ItemsList({
  items,
  pathname,
}: {
  items: ItemCardProps[];
  pathname?: string; // Accept pathname as a prop
}) {
  return (
    <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        return <ItemCard key={item.id} item={item} pathname={pathname} />; // Pass pathname to ItemCard
      })}
    </section>
  );
}

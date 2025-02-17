import ItemsList from './ItemsList';
import EmptyList from './EmptyList';
import type { ItemCardProps } from '@/utils/types';

export default function ItemsContainer({
  items,
}: {
  items: ItemCardProps[];
}) {
  if (items.length === 0) {
    return (
      <EmptyList
        heading="No Results"
        message="Try changing or removing some of your filters"
        btnText="Clear Filters"
      />
    );
  }

  return <ItemsList items={items} />;
}

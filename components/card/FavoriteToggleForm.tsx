'use client';

import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { toggleFavoriteAction } from '@/utils/actions';
import { CardSubmitButton } from '../form/Button';

type FavoriteToggleFormProps = {
  itemId: string;
  favoriteId: string | null;
  itemType: "property" | "airline" | "tour";
};

export default function FavoriteToggleForm({
  itemId,
  favoriteId,
  itemType,
}: FavoriteToggleFormProps) {
  const pathname = usePathname() ?? '/';
  const toggleAction = () =>
    toggleFavoriteAction({
      itemId,
      favoriteId,
      itemType,
      pathname,
    });

  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavorite={!!favoriteId} />
    </FormContainer>
  );
}

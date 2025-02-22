import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsLoadingContainer() {
  return (
    <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
}


function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='w-full h-20 rounded' />
      </CardHeader>
    </Card>
  );
}

export function ChartsLoadingContainer() {
  return <Skeleton className='mt-16 w-full h-[300px] rounded' />;
}
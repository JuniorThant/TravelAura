'use client'
import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <Skeleton className="h-[300px] md:h-[500]px w-full rounded"/>
  )
}

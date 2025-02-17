import { fetchStats } from '@/utils/actions'
import React from 'react'
import StatsCard from './StatsCard'

export default async function StatsContainer() {
  const data=await fetchStats()
  return (
    <div className='mt-8 grid md:grid-cols-4 gap-4 overflow-x-auto'>
      <StatsCard title='users' value={data.userCount || 0}/>
      <StatsCard title='properties' value={data.propertiesCount || 0}/>
      <StatsCard title='airlines' value={data.airlinesCount || 0}/>
      <StatsCard title='bookings' value={data.bookingsCount || 0}/>
    </div>
  )
}

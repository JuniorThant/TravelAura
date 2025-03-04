import { fetchReserveStats, fetchStats, getAuthUser } from '@/utils/actions'
import React from 'react'
import StatsCard from './StatsCard'

export default async function StatsContainer({serviceType}: {serviceType?: string}) {
  if(!serviceType){
    const data=await fetchStats()
    return (<>
    <h3 className='text-4xl font-semibold text-center'>Admin Statistics</h3>
      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        <StatsCard title='users' value={data.userCount || 0}/>
        <StatsCard title='properties' value={data.propertiesCount || 0}/>
        <StatsCard title='airlines' value={data.airlinesCount || 0}/>
        <StatsCard title='tours' value={data.toursCount || 0}/>
        <StatsCard title='bookings' value={data.bookingsCount || 0}/>
        <StatsCard title='total income' value={data.totalIncome || 0} dollar/>
      </div>
      </>)
  }

  const user=await getAuthUser()

  const data=await fetchReserveStats(serviceType,user.id)

  if(serviceType==='property'){
    return(<>
      <h3 className='text-3xl font-semibold text-center'>Reservation Statistics</h3>
      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5'>
        <StatsCard title='rooms' value={data?.roomsCount || 0}/>
        <StatsCard title='bookings' value={data?.roomBookingsCount || 0}/>
        <StatsCard title='total income' value={data?.roomIncome || 0} dollar/>
      </div>
      </>)
  }
  if(serviceType==='airline'){
    return(<>
      <h3 className='text-3xl font-semibold text-center'>Reservation Statistics</h3>
      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5'>
        <StatsCard title='schedules' value={data?.schedulesCount || 0}/>
        <StatsCard title='bookings' value={data?.airBookingsCount || 0}/>
        <StatsCard title='total income' value={data?.airIncome || 0} dollar/>
      </div>
    </>)
  }
  if(serviceType==='tour'){
    return(<>
      <h3 className='text-3xl font-semibold text-center'>Reservation Statistics</h3>
      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5'>
        <StatsCard title='packages' value={data?.packagesCount || 0}/>
        <StatsCard title='bookings' value={data?.tourBookingsCount || 0}/>
        <StatsCard title='total income' value={data?.tourIncome || 0} dollar/>
      </div>
    </>)
  }
 
}

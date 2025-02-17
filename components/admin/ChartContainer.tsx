'use client'
import { fetchSalesDataDay, fetchSalesDataMonth } from '@/utils/actions'
import React, { useState, useEffect } from 'react'
import Chart from './Chart'
import { Button } from '../ui/button'

// Define the type for your data
type Booking = {
  date: string
  total: number
}

export default function ChartContainer() {
  const [data, setData] = useState<Booking[]>([])
  const [isMonthly, setIsMonthly] = useState(false)

  // Fetch initial daily data
  useEffect(() => {
    const getData = async () => {
      const bookings = await fetchSalesDataDay()
      setData(bookings)
    }
    getData()
  }, [])

  // Function to toggle between daily and monthly data
  const changeMonth = async () => {
    if (isMonthly) {
      const bookings = await fetchSalesDataDay()
      setData(bookings)
    } else {
      const monthsBookings = await fetchSalesDataMonth()
      setData(monthsBookings)
    }
    setIsMonthly(!isMonthly)
  }

  if (data.length < 1) return null

  return (
    <>
      <Chart data={data} isMonthly={isMonthly} />
      <Button onClick={changeMonth}>
        {isMonthly ? 'By Days' : 'By Months'}
      </Button>
    </>
  )
}

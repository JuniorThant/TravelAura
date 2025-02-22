'use client';
import { useState, useEffect } from 'react';
import { fetchAirlineById, fetchSchedules } from "@/utils/actions";
import Image from "next/image";
import { Button } from '../ui/button';
import { FaLongArrowAltRight, FaRegArrowAltCircleDown } from "react-icons/fa";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { useAirline, useAirlineBooking, useBool, useCalendar, usePackage, useRoom, useSearch } from '@/utils/store';
import Amenities from '../properties/Amenities';
import Title from '../properties/Title';
import { RoundTripSchedule, ScheduleProps } from '@/utils/types';
import { Skeleton } from '../ui/skeleton';
import EmptyList from '../home/EmptyList';
import { Card } from '../ui/card';

export default function Schedules({ airlineId }: { airlineId: string }) {
  const [logo, setLogo] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<(ScheduleProps | RoundTripSchedule)[]>([]);
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const {scheduleIds}=useAirlineBooking((state)=>state)

  const airlineState = useAirline((state) => state);
  console.log(airlineState)

  useEffect(() => {
    useCalendar.setState({
      range: undefined,
    });

    useBool.setState({
      boolAir:true,
      boolRoom:false,
      boolTour:false
    })

    useRoom.setState({
      price:0,
      roomId:''
    })

    if(scheduleIds){
      useAirlineBooking.setState({
        scheduleIds:[]
      })
    }

    usePackage.setState({
      packageId:''
    })

    const getLogo = async () => {
      const airline = await fetchAirlineById(airlineId);
      if (airline && 'logo' in airline) {
        setLogo(airline.logo);
      }
    };

    getLogo();
  }, [airlineId]);

  useEffect(() => {
    const getSchedules = async () => {
      setLoading(true); // Start loading
      const fetchedSchedules = await fetchSchedules({
        airlineId,
        travelDate: airlineState.travelDate || undefined,
        returnDate: airlineState.returnDate || undefined,
        guests: airlineState.guests || undefined,
        origin: airlineState.origin || undefined,
        destination: airlineState.destination || undefined,
        class: airlineState.flightClass || undefined,
      });

      setSchedules(fetchedSchedules as (ScheduleProps | RoundTripSchedule)[]);
      setLoading(false); // Stop loading
    };

    getSchedules();
    
    useBool.setState({
      boolRoom:false,
      boolAir:true,
      boolTour:false,
    })
  }, [airlineId, airlineState]);

  const handleState = (scheduleId: string, price: number, bookingDetails: any, oneWay?: boolean) => {
    const { setBooking, scheduleIds, resetBooking } = useAirlineBooking.getState();
  
    if (oneWay) {
      // If it's a one-way trip, reset and only keep the selected flight
      resetBooking();
      setBooking(scheduleId, price, bookingDetails);
    } else {
      // If it's a round-trip, ensure max 2 selections (outbound + return)
      if (scheduleIds.length >= 2) {
        resetBooking();
      }
      setBooking(scheduleId, price, bookingDetails);
    }
  };
  
  

  const toggleDetails = (scheduleId: string) => {
    setExpandedScheduleId((prevId) => (prevId === scheduleId ? null : scheduleId));
  };

  if (loading) {
    return <Skeleton className="h-[200px] md:h-[200px] w-full rounded" />;
  }

  if (schedules.length === 0) {
    return <EmptyList heading="No flights available" message="Try adjusting your search criteria." />;
  }

  return (
    <>
      <Title text="Available Flights" />
      <div className="space-y-5">
        {schedules.map((schedule) => {
          // Check if it's a round trip schedule (outbound and return)
          if ('outbound' in schedule && 'returnTrip' in schedule) {
            return (
              <div className='twoWays'>
              <Card key={`outbound-${schedule.outbound.id}`} className="flex p-4" style={{ position: 'relative' }}>
              <div className="w-60 h-24 flex items-center justify-center">
                {logo && (
                  <Image
                    src={logo}
                    alt="Airline Logo"
                    width={0}
                    height={0}
                    layout="responsive"
                  />
                )}
              </div>
              <div className="ml-4 flex flex-col justify-between w-full">
                  <div className="text-md">{schedule.outbound.flightCode}</div>
                  <div>{schedule.outbound.departureTime.toLocaleDateString()}</div>
                <div className="flex text-sm">
                <div className="flex flex-col text-lg w-full">
                <div className="flex justify-between items-center">
                  <div>{schedule.outbound.departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <FaLongArrowAltRight className="w-6 h-6" /> {/* Adjust the size of the arrow */}
                  <div>{schedule.outbound.arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>{schedule.outbound.originAirport}</div>
                  <div>{schedule.outbound.destinationAirport}</div>
                </div>
              </div>
                </div>
                <div className="flex justify-between text-sm mt-5">
                  <div className="flex items-center gap-2">
                  <div className="font-bold text-lg text-blue-500">{schedule.outbound.price}$</div>
                  </div>
                  <div className='flex gap-3'>
                    <Button onClick={() => handleState(schedule.outbound.id, schedule.outbound.price, [])}>{scheduleIds.includes(schedule.outbound.id) ? "Selected" : "Select"}</Button>
                    <button onClick={() => toggleDetails(schedule.outbound.id)} className="flex items-center gap-2">
                      {expandedScheduleId === schedule.outbound.id ? <FaRegArrowAltCircleUp /> : <FaRegArrowAltCircleDown />}
                  </button>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedScheduleId === schedule.outbound.id ? 'max-h-[1000px] py-4' : 'max-h-0 py-0'}`}
                >
                  {expandedScheduleId === schedule.outbound.id && (
                    <div className="mt-4 text-sm">
                      <Amenities amenities={schedule.outbound.amenities} text='' />
                    </div>
                  )}
                </div>
              </div>
            </Card>

              <Card key={`return-${schedule.returnTrip.id}`} className=" flex p-4" style={{ position: 'relative' }}>
              <div className="w-60 h-24 flex items-center justify-center">
                {logo && (
                  <Image
                    src={logo}
                    alt="Airline Logo"
                    width={0}
                    height={0}
                    layout="responsive"
                  />
                )}
              </div>
              <div className="ml-4 flex flex-col justify-between w-full">
                <div className='flex justify-between items-center'>
                <div className="text-md">{schedule.returnTrip.flightCode}</div>
                <div className="text-md text-blue-500">Return</div>
                </div>
                  <div>{schedule.returnTrip.departureTime.toLocaleDateString()}</div>
                <div className="flex text-sm">
                <div className="flex flex-col text-lg w-full">
                <div className="flex justify-between items-center">
                  <div>{schedule.returnTrip.departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <FaLongArrowAltRight className="w-6 h-6" /> {/* Adjust the size of the arrow */}
                  <div>{schedule.returnTrip.arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>{schedule.returnTrip.originAirport}</div>
                  <div>{schedule.returnTrip.destinationAirport}</div>
                </div>
              </div>
                </div>
                <div className="flex justify-between text-sm mt-5">
                  <div className="flex items-center gap-2">
                  <div className="font-bold text-lg text-blue-500">{schedule.returnTrip.price}$</div>
                  </div>
                  <div className='flex gap-3'>
                  <Button onClick={() => handleState(schedule.returnTrip.id, schedule.returnTrip.price, [])}>{scheduleIds.includes(schedule.returnTrip.id) ? "Selected" : "Select"}</Button>
                  <button onClick={() => toggleDetails(schedule.returnTrip.id)} className="flex items-center gap-2">
                    {expandedScheduleId === schedule.returnTrip.id ? <FaRegArrowAltCircleUp /> : <FaRegArrowAltCircleDown />}
                  </button>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedScheduleId === schedule.returnTrip.id ? 'max-h-[1000px] py-4' : 'max-h-0 py-0'}`}
                >
                  {expandedScheduleId === schedule.returnTrip.id && (
                    <div className="mt-4 text-sm">
                      <Amenities amenities={schedule.returnTrip.amenities} text='' />
                      
                    </div>
                  )}
                </div>
              </div>
            </Card>
            </div>
              
            );
          }

          // For individual flight schedules
          return (
            <Card key={`single-${schedule.id}`} className=" flex p-4" style={{ position: 'relative' }}>
              <div className="w-60 h-24 flex items-center justify-center">
                {logo && (
                  <Image
                    src={logo}
                    alt="Airline Logo"
                    width={0}
                    height={0}
                    layout="responsive"
                  />
                )}
              </div>
              <div className="ml-4 flex flex-col justify-between w-full">
                  <div className="text-md">{schedule.flightCode}</div>
                  <div>{schedule.departureTime.toLocaleDateString()}</div>
                <div className="flex text-sm">
                <div className="flex flex-col text-lg w-full">
                <div className="flex justify-between items-center">
                  <div>{schedule.departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <FaLongArrowAltRight className="w-6 h-6" /> {/* Adjust the size of the arrow */}
                  <div>{schedule.arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>{schedule.originAirport}</div>
                  <div>{schedule.destinationAirport}</div>
                </div>
              </div>
                </div>
                <div className="flex justify-between text-sm mt-5">
                  <div className="flex items-center gap-2">
                  <div className="font-bold text-lg text-blue-500">{schedule.price}$</div>
                  </div>
                  <div className='flex gap-3'>
                  <Button className='outline' onClick={() => handleState(schedule.id, schedule.price, [], true)}>{scheduleIds.includes(schedule.id) ? "Selected" : "Select"}</Button>
                  <button onClick={() => toggleDetails(schedule.id)} className="flex items-center gap-2">
                    {expandedScheduleId === schedule.id ? <FaRegArrowAltCircleUp /> : <FaRegArrowAltCircleDown />}
                  </button>
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedScheduleId === schedule.id ? 'max-h-[1000px] py-4' : 'max-h-0 py-0'}`}
                >
                  {expandedScheduleId === schedule.id && (
                    <div className="mt-4 text-sm">
                      <Amenities amenities={schedule.amenities} text='' />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

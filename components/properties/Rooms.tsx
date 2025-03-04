'use client';
import { useState, useEffect } from 'react';
import { fetchRooms } from "@/utils/actions";
import Image from "next/image";
import { RoomProps } from '@/utils/types';
import { Button } from '../ui/button';
import Amenities from './Amenities';
import { IoBedSharp } from "react-icons/io5";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { GiTheaterCurtains } from "react-icons/gi";
import Title from './Title';
import {  useAirlineBooking, useBool, usePackage, useRoom, useSearch } from '@/utils/store';
import { Card } from '../ui/card';

export default function Rooms({ propertyId }: { propertyId: string }) {
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);

  // Listen to the search state from useSearch
  const searchState = useSearch((state) => state);
  const {roomId:rId}=useRoom((state)=>state)

  useEffect(() => {
    const getRooms = async () => {
      const fetchedRooms = await fetchRooms({
        propertyId,
        checkIn: searchState.checkIn || undefined, // Optional: Send only if defined
        checkOut: searchState.checkOut || undefined, // Optional: Send only if defined
        guests: searchState.guests || undefined, // Optional: Send only if defined
      });
      setRooms(fetchedRooms);
    };

    getRooms();
    useBool.setState({
      boolRoom:true,
      boolAir:false,
      boolTour:false,
    })
    useAirlineBooking.setState({
      scheduleIds:[]
    })
    usePackage.setState({
      packageId:''
    })
  }, [propertyId, searchState]); // Re-fetch rooms when searchState changes

  const handleState = (roomId: string, price: number, bookings: any[]) => {
    useRoom.setState({
      roomId,
      price,
      bookings,
    });
    if(roomId===rId){
      useRoom.setState({
        roomId:'',
        price:0,
        bookings:[]
      })
    }
  };

  const toggleDetails = (roomId: string) => {
    // Toggle the expanded room
    setExpandedRoomId((prevId) => (prevId === roomId ? null : roomId));
  };

  return (
    <>
      <Title text="Available Rooms in This Hotel" />
      <div className="space-y-5">
        {rooms.map((room) => (
          <Card key={room.id} className=" flex p-4" style={{ position: 'relative' }}>
            <div className="w-60 h-24 flex items-center justify-center">
              {room.image ? (
                <div className="relative w-40 h-24">
                <Image
                  src={room.image}
                  alt="Room image"
                  fill
                  className='object-cover'
                />
                </div>
              ) : (
                <span>Room Image</span>
              )}
            </div>
            <div className="ml-4 flex flex-col justify-between w-full">
              <div className="flex justify-between text-sm">
                <div className="text-md">{room.type}</div>
                <div className="font-bold">{room.price}$ per night</div>
              </div>
              <div className="flex text-sm">
                <div className="flex items-center gap-2">
                  <GiTheaterCurtains className="w-5 h-5" />
                  {room.view}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <IoBedSharp className="w-5 h-5" />
                  {room.beds}
                </div>
                <div className='flex gap-3'>
                <Button 
                    onClick={() => handleState(room.id, room.price, [])} 
                  >
                    {rId===room.id ? "Selected" : "Select"}
                  </Button>
                  <button onClick={() => toggleDetails(room.id)} className="flex items-center gap-2">
                    {expandedRoomId === room.id ? <FaRegArrowAltCircleUp /> : <FaRegArrowAltCircleDown />}
                  </button>
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedRoomId === room.id ? 'max-h-[1000px] py-4' : 'max-h-0 py-0'
                }`}
              >
                {expandedRoomId === room.id && (
                  <div className="mt-4 text-sm">
                    <Amenities amenities={room.amenities} text='This room includes'/>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

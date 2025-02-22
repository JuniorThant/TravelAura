'use client';
import { useState, useEffect } from 'react';
import { fetchPackages } from "@/utils/actions";
import Image from "next/image";
import { PackageProps } from '@/utils/types';
import { Button } from '../ui/button';
import { IoBedSharp } from "react-icons/io5";
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import Title from '../properties/Title';
import { Card } from '../ui/card';
import { useAirlineBooking, useBool, usePackage, useRoom } from '@/utils/store';

export default function Packages({ tourId }: { tourId: string }) {
  const [packages, setPackages] = useState<PackageProps[]>([]);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  const {packageId:pkgId}=usePackage((state)=>state)

  // Fetch packages on mount
  useEffect(() => {
    async function loadPackages() {
      const data = await fetchPackages({ tourId });
      setPackages(data);
    }
    loadPackages();
    usePackage.setState({
        tour:true
    })
    useBool.setState({
        boolRoom:false,
        boolAir:false,
        boolTour:true,
      })
    useAirlineBooking.setState({
        scheduleIds:[]
    })
    useRoom.setState({
        price:0,
        roomId:''
    })
  }, [tourId]);

  // Toggle function
  const toggleDetails = (packageId: string) => {
    setExpandedPackageId((prevId) => (prevId === packageId ? null : packageId));
  };

  const handleState=(packageId:string,price:number)=>{
    usePackage.setState({
        packageId,
        pricePackage:price
    })
    if(packageId===pkgId){
      usePackage.setState({
        packageId:''
    })
    }
  }

  return (
    <>
      <Title text="Available Tour Packages" />
      <div className="space-y-5">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="border flex p-4" style={{ position: 'relative' }}>
            <div className="w-60 h-24 flex items-center justify-center">
              {pkg.image ? (
                <div className="relative w-40 h-24">
                <Image
                  src={pkg.image}
                  alt="Package image"
                  fill
                  className="object-cover"
                />
              </div>              
              ) : (
                <span>Package Image</span>
              )}
            </div>
            <div className="ml-4 flex flex-col justify-between w-full">
              <div className="flex justify-between text-sm">
                <div className="text-md font-bold">{pkg.name}</div>
                <div className="font-bold">{pkg.price}$ per package</div>
              </div>
              <div className='mt-5'>
              <div><b>Departure Date:</b> {new Date(pkg.departureDate).toLocaleDateString()}</div>
                <div><b>Arrival Date:</b> {new Date(pkg.arrivalDate).toLocaleDateString()}</div>
              </div>
              <div className="flex text-sm justify-end gap-3">
              <Button onClick={()=>handleState(pkg.id,pkg.price)}>{pkg.id === pkgId?"Selected":'Select'}</Button>
                <button onClick={() => toggleDetails(pkg.id)} className="flex items-center gap-2">
                  {expandedPackageId === pkg.id ? <FaRegArrowAltCircleUp /> : <FaRegArrowAltCircleDown />}
                </button>
              </div>

              {/* Expanded Section for Description & Itinerary */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedPackageId === pkg.id ? ' py-4' : 'max-h-0 py-0'
                }`}
              >
                {expandedPackageId === pkg.id && (
                  <div className="mt-4 text-sm space-y-4">
                    <div>
                      <h4 className="font-semibold">Description:</h4>
                      <p className="text-gray-700">{pkg.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Itinerary:</h4>
                      <p className="text-gray-700">{pkg.itinerary}</p>
                    </div>
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

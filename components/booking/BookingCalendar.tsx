'use client'
import { useEffect, useState } from "react";
import { useAirline, useAirlineBooking, useBool, useCalendar, usePackage, useRoom, useSearch } from "@/utils/store";
import { DateRange, DayPicker} from "react-day-picker";
import { SearchIcon } from "lucide-react";
import GuestSelect from "../ui/guestselect";
import "react-day-picker/style.css";
import {
  generateDisabledDates,
  generateDateRange,
  defaultSelected,
  generateBlockedPeriods,
} from "@/utils/calendar";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { fetchAirlineById, haveProperty } from "@/utils/actions";
import ClassSelect from "../airlines/ClassSelect";
import FormInput from "../form/FormInput";

export default function BookingCalendar() {
  const currentDate = new Date();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const roomBookings=useRoom((state)=>state.bookings)
  const airBookings=useAirlineBooking((state)=>state.bookings)
  const {boolRoom,boolAir,boolTour}=useBool((state)=>state)


  const bookings = (roomBookings && roomBookings.length > 0) ? roomBookings : airBookings;
  const blockedPeriods=generateBlockedPeriods({
    bookings,
    today:currentDate
  })

  const {tour}=usePackage(state=>state)

  const [property, setProperty] = useState<boolean | null>(null);

  // ✅ States for inputs
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const [guests, setGuests] = useState(1);
  const [guestsPackage, setGuestsPackage] = useState(1);
  const [classes, setClasses] = useState("");
  const [origin, setOrigin] = useState(""); // ✅ Added origin state
  const [destination, setDestination] = useState(""); // ✅ Added destination state

  // Fetch property status when component mounts or id changes
  useEffect(() => {
    const fetchProperty = async () => {
      const result = await haveProperty(id);
      setProperty(result);
    };
    fetchProperty();
  }, [id]);

  // Update store when range changes
  useEffect(() => {
    useRoom.setState({ range });
    useCalendar.setState({range})
    if(boolAir){
      useAirline.setState({guests:guests})
    }
    if (boolTour) {
      usePackage.setState({ guestsPackage: guestsPackage });
    }
  }, [range, guests,guestsPackage]);

  // ✅ Handle search with all required states
  const handleSearch = async () => {
    if (!property) {
      if(range?.from?.getTime() === range?.to?.getTime()){
        useAirline.setState({
          travelDate: range?.from as Date,
          returnDate: null,
          flightClass:classes || 'economy',
          guests: guests,
          origin: origin, // ✅ Added origin
          destination: destination, // ✅ Added destination
        });
      }else{
        useAirline.setState({
          travelDate: range?.from as Date,
          returnDate: range?.to as Date,
          flightClass:classes || 'economy',
          guests: guests,
          origin: origin, // ✅ Added origin
          destination: destination, // ✅ Added destination
        });
      }
    } else {
      useSearch.setState({
        checkIn: range?.from as Date,
        checkOut: range?.to as Date,
        guests: guests,
      });
    }
  };

  return (
    <div>
      <div>
        {(boolAir || boolRoom) && <DayPicker
          mode="range"
          defaultMonth={currentDate}
          selected={range}
          onSelect={setRange}
          disabled={blockedPeriods}
        />}
        {boolAir && (
          <>
            <div className="lg:col-span-12 flex">
            <div className="lg:col-span-6 ml-2">
            <FormInput
              name="origin"
              type="text"
              label="departure city"
              value={origin} // ✅ Bind value to state
              onChange={(e) => setOrigin(e.target.value)} // ✅ Update state on change

            />
              </div>

              <div className="lg:col-span-6 ml-2">
              <FormInput
              name="destination"
              type="text"
              label="arrival city"
              value={destination} // ✅ Bind value to state
              onChange={(e) => setDestination(e.target.value)} // ✅ Update state on change
            />
              </div>
            </div>
            
            
          </>
        )}
      </div>
      <div className="flex justify-between mb-4">
        {(boolAir || boolRoom) &&<GuestSelect onValueChange={setGuests} />}
        {boolTour &&<GuestSelect onValueChange={setGuestsPackage} />}
        {(boolAir || boolRoom) && <Button onClick={handleSearch}>
          <SearchIcon className="w-6 h-6" />
        </Button>}
      </div>
    </div>
  );
}

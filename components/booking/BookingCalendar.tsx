'use client'
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { useAirline, useAirlineBooking, useCalendar, useRoom, useSearch } from "@/utils/store";
import { DateRange } from "react-day-picker";
import { SearchIcon } from "lucide-react";
import GuestSelect from "../ui/guestselect";
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
  const state=useAirline(state=>state)
  const roomBookings=useRoom((state)=>state.bookings)
  console.log(roomBookings)
  const airBookings=useAirlineBooking((state)=>state.bookings)

  const bookings = (roomBookings && roomBookings.length > 0) ? roomBookings : airBookings;
  const blockedPeriods=generateBlockedPeriods({
    bookings,
    today:currentDate
  })


  // ✅ State for async property check
  const [property, setProperty] = useState<boolean | null>(null);

  // ✅ States for inputs
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const [guests, setGuests] = useState(1);
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
  }, [range, guests]);

  // ✅ Handle search with all required states
  const handleSearch = async () => {
    if (!property) {
      useAirline.setState({
        travelDate: range?.from as Date,
        returnDate: range?.to as Date,
        flightClass:classes || 'economy',
        guests: guests,
        origin: origin, // ✅ Added origin
        destination: destination, // ✅ Added destination
      });
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
        <Calendar
          mode="range"
          defaultMonth={currentDate}
          selected={range}
          onSelect={setRange}
          className="mb-1"
          disabled={blockedPeriods}
        />
        {!property && (
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
        <GuestSelect onValueChange={setGuests} />
        <Button onClick={handleSearch}>
          <SearchIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

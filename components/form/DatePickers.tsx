"use client"; // Ensure this runs on the client

import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { DatePickerDemo } from "../ui/datapickerdemo";

type DateValue = Date | null;

export default function DatePickers({
  defaultDeparture,
  defaultArrival,
  onlyDate
}: {
  defaultDeparture?: string;
  defaultArrival?: string;
  onlyDate?:boolean;
}) {
  const [departureTime, setDepartureTime] = useState<Date | null>(
    defaultDeparture ? new Date(defaultDeparture) : null
  );
  const [arrivalTime, setArrivalTime] = useState<Date | null>(
    defaultArrival ? new Date(defaultArrival) : null
  );

  if(!onlyDate){
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-4">
      <div>
        <label className="block font-medium mb-1">Date and Time of Departure</label>
        <DateTimePicker onChange={setDepartureTime} value={departureTime} />
        <input type="hidden" name="departureTime" value={departureTime?.toISOString()} />
      </div>

      <div>
        <label className="block font-medium mb-1">Date and Time of Arrival</label>
        <DateTimePicker onChange={setArrivalTime} value={arrivalTime} />
        <input type="hidden" name="arrivalTime" value={arrivalTime?.toISOString()} />
      </div>
    </div>
  );
  }else{
    return (
        <div className="grid md:grid-cols-2 gap-8 mb-4">
          <div>
            <DatePickerDemo label="Date and Time of Departure" onChange={setDepartureTime} value={departureTime} />
            <input type="hidden" name="departureTime" value={departureTime?.toISOString()} />
          </div>
    
          <div>
            <DatePickerDemo label="Date and Time of Arrival"  onChange={setArrivalTime} value={arrivalTime} />
            <input type="hidden" name="arrivalTime" value={arrivalTime?.toISOString()} />
          </div>
        </div>
      );
  }
}

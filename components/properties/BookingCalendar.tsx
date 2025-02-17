'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';

export default function App() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normalize to midnight

  const defaultSelected: DateRange = {
    from: undefined,
    to: undefined,
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

  return (
    <Calendar
      id="test"
      mode="range"
      defaultMonth={currentDate}
      selected={range}
      onSelect={setRange}
      disabled={(date) => {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0); // Normalize the date to midnight
        return normalizedDate < currentDate; // Disable dates before today
      }}
    />
  );
}

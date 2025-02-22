import { create } from 'zustand';
import { Booking } from './types';
import { DateRange } from 'react-day-picker';
// Define the state's shape
type RoomState = {
  roomId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
};

// Create the store
export const useRoom = create<RoomState>(() => {
  return {
    roomId: '',
    price: 0,
    bookings: [],
    range: undefined
  };
});

type CalendarState={
  range:DateRange | undefined;
}

export const useCalendar=create<CalendarState>(()=>{
  return{
    range:undefined
  }
})

type SearchState = {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
};

export const useSearch = create<SearchState>(() => {
  return {
    checkIn: null,
    checkOut: null,
    guests: 0,
  };
});

type AirlineState={
  travelDate: Date | null;
  returnDate: Date | null;
  guests:number;
  origin:string | null;
  destination:string | null;
  flightClass: string | null;
}

export const useAirline = create<AirlineState>(() => {
  return {
    travelDate:null,
    returnDate:null,
    guests:1,
    origin:'',
    destination:'',
    flightClass:''
  };
});

type PackageBookingState={
  tour:boolean,
  packageId:string,
  pricePackage:number,
  guestsPackage:number
}

export const usePackage=create<PackageBookingState>(()=>{
  return{
    tour:false,
    packageId:"",
    pricePackage:0,
    guestsPackage:1
  } 
})

type AirlineBookingState = {
  scheduleIds: string[];
  prices: number[];
  bookings: any[];
  setBooking: (scheduleId: string, price: number, bookingDetails: any) => void;
  resetBooking: () => void; // Add reset function
};

export const useAirlineBooking = create<AirlineBookingState>((set) => ({
  scheduleIds: [],
  prices: [],
  bookings: [],
  setBooking: (scheduleId, price, bookingDetails) =>
    set((state) => {
      const index = state.scheduleIds.indexOf(scheduleId);
      if (index === -1) {
        // If the scheduleId is not already selected
        return {
          scheduleIds: [...state.scheduleIds, scheduleId],
          prices: [...state.prices, price],
          bookings: [...state.bookings, bookingDetails],
        };
      } else {
        return state; // Do nothing if it's already selected
      }
    }),
  resetBooking: () => set({ scheduleIds: [], prices: [], bookings: [] }), // Reset all state
}));


type BoolState={
  boolRoom:boolean;
  boolAir:boolean;
  boolTour:boolean;
}

export const useBool=create<BoolState>(()=>{
  return{
    boolRoom:false,
    boolAir:false,
    boolTour:false,
  }
})

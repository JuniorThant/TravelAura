export type actionFunction=(prevState:any,formData:FormData)=>Promise<{message:string}>

export type ItemCardProps = {
    id: string;
    name: string;
    image: string;
    tagline?: string;
    type: 'property' | 'airline' | 'tour';
  };

  export type PendingProps = {
    id: string;
    name?: string;
    tagline?: string;
    image?: string;
    description?: string;
    file?: string;
    address?: string;
    category?: string;
    amenities?: string;
    logo?: string;
    type?: "property" | "airline" | "tour"; // Add missing type field
    email?: string; // Add missing email field
  };
  
  

  export type RoomProps = {
    id: string;
    type: string;
    image: string;
    description: string;
    price: number;
    guests: number;
    quantity: number;
    beds: string;
    amenities: string; // Note that amenities is a string; you can split it into an array if needed
    view: string;
    propertyId: string; // This is now required
    bookings?: Booking[]; // Add bookings property
  };
  
  export type ScheduleProps = {
    id: string;                  // Unique schedule identifier
    flightCode: string;          // Flight identifier (e.g., AA1234)
    departureTime: Date;         // Date and time of departure
    arrivalTime: Date;           // Date and time of arrival
    origin: string;              // Airport or city of origin
    destination: string;         // Destination airport or city
    originAirport: string;       // Origin airport name
    destinationAirport: string;  // Destination airport name
    price: number;               // Price of the flight
    status: string;              // Flight status (e.g., "On Time", "Delayed")
    amenities: string;           // Amenities as a string (split into an array if needed)
    economyCount: number;        // Available economy seats
    businessCount: number;       // Available business seats
    firstClassCount: number;     // Available first-class seats
    airlineId: string;           // Associated airline ID
  };

  export type RoundTripSchedule = {
    outbound: ScheduleProps;
    returnTrip: ScheduleProps;
  };
  
  
  export type DateRangeSelect = {
    startDate: Date;
    endDate: Date;
    key: string;
  };
  
  export type Booking = {
    checkIn: Date;
    checkOut: Date;
  };

  
  
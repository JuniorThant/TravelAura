"use server"
import { airlineSchema, fileSchema, imageSchema, profileSchema, propertySchema, roomSchema, scheduleSchema, tourSchema, validateWithZodSchema } from "./schema"
import db from './db';
import {  clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UploadFile, UploadImage } from "./supabase";
import { calculateTotals, calculateTotalsAirline } from "./calculateTotals";
import { RoomProps } from "./types";
import { formatDate } from "./format";
import { sendApprovalEmail } from "./email";


export const getAuthUser = async () => {
    const user = await currentUser()
    if (!user) {
        throw new Error("You must be logged in to access this route")
    }
    if (!user.privateMetadata.hasProfile) redirect('/profile/create')
    return user
}

const getAdminUser=async()=>{
  const user=await getAuthUser()
  if(user.id !== process.env.ADMIN_USER_ID) redirect('/')
  return user
}

export const hasProperty=async(clerkId:string | null)=>{
  try {
    if(clerkId){
    const user = await db.profile.findUnique({
      where: {
        clerkId,
      },
      select: {
        properties: {
          select: {
            id: true, // Select the property ID
          },
        },
      },
    });

    // Check if the user has any properties
    if (user?.properties && user.properties.length > 0) {
      return true; // The user has created at least one property
    }}
      return false; // The user hasn't created any property
    } catch (error) {
      console.error('Error checking properties:', error);
      return false; // Return false in case of an error
    }
  };

  export const hasAirline=async(clerkId:string | null)=>{
    try {
      if(clerkId){
      const user = await db.profile.findUnique({
        where: {
          clerkId,
        },
        select: {
          airlines: {
            select: {
              id: true, // Select the property ID
            },
          },
        },
      });
  
      // Check if the user has any properties
      if (user?.airlines && user.airlines.length > 0) {
        return true; // The user has created at least one property
      }
    }
        return false; // The user hasn't created any property
      } catch (error) {
        console.error('Error checking properties:', error);
        return false; // Return false in case of an error
      }
    };

export const fetchAirlineById = async (id: string) => {
  try {
    const airline = await db.airline.findUnique({
      where: {
        id,
      },
      select:{
        logo:true
      },
    });

    if (!airline) {
      throw new Error('Airline not found');
    }

    return airline;
  } catch (error) {
    return renderError(error);
  }
};


const renderError=(error:unknown):{message:string}=>{
    return { message: error instanceof Error ? error.message : 'there was an error' }
}

export const createProfileAction = async (prevState: any, formData: FormData) => {
    try {
        const user = await currentUser()
        if (!user) throw new Error('Please login to create a profile')
        const rawData = Object.fromEntries(formData)
        const validatedFields=validateWithZodSchema(profileSchema,rawData)
        await db.profile.create({
            data: {
              clerkId: user.id,
              email: user.emailAddresses[0].emailAddress,
              profileImage: user.imageUrl ?? '',
              role:"User",
              ...validatedFields,
            },
          });
          
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true
            }
        })
    } catch (error) {
        return renderError(error)
    }
    redirect('/')
}

export const fetchProfileImage = async () => {
    const user = await currentUser()
    if (!user) return null
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        },
        select: {
            profileImage: true
        }
    })

    return profile?.profileImage
}


export const haveProperty = async (id: string): Promise<boolean> => {
  const property = await db.property.findUnique({
    where: { id },
    select: { id: true },
  });

  return !!property;
};


export const fetchProfile = async () => {
    const user = await getAuthUser()
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        }
    })
    if (!profile) redirect('/profile/create')
    return profile
}

export const updateProfile = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
    const user=await getAuthUser()
    try{
        const rawData = Object.fromEntries(formData)
        const validatedFields=validateWithZodSchema(profileSchema,rawData)
        
        await db.profile.update({
            where:{
                clerkId:user.id
            },
            data:validatedFields
        })
        revalidatePath('/profile')
        return { message: 'Update Profile Action' }
    }catch(error){
        return renderError(error)
    }
}

export const updateProfileImage = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user=await getAuthUser()
    try{
        const image=formData.get('image') as File
        const validatedFields=validateWithZodSchema(imageSchema,{image})
        const fullPath=await UploadImage(validatedFields.image)

        await db.profile.updateMany({
            where:{
                clerkId:user.id
            },data:{
                profileImage:fullPath
            }
        })
        revalidatePath('/profile')
        return { message: 'Profile image updated successfully' };
    }catch(error){
        return renderError(error)
    }
    
  };

  export const createPropertyAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user=await getAuthUser()
    try{
      const rawData=Object.fromEntries(formData)
      const file=formData.get('image') as File
      const pdf=formData.get('file') as File
        const validatedFields=validateWithZodSchema(propertySchema,rawData)
        console.log(validatedFields)
        const validatedFile=validateWithZodSchema(imageSchema,{image:file})
        const fullPath=await UploadImage(validatedFile.image)
        const validatedPDF=validateWithZodSchema(fileSchema,{file:pdf})
        const pdfPath=await UploadFile(validatedPDF.file)
        await db.property.create({
            data:{
                ...validatedFields,
                image:fullPath,
                profileId:user.id,
                file:pdfPath
            }
        })
        redirect('/')
    }catch(error){
        return renderError(error)
    }
  }

  export const createAirlineAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user=await getAuthUser()
    const rawData=Object.fromEntries(formData)
    const file=formData.get('image') as File
    const logo=formData.get('logo') as File
    const pdf=formData.get('file') as File
    try{
        const validatedFields=validateWithZodSchema(airlineSchema,rawData)
        const validatedFile=validateWithZodSchema(imageSchema,{image:file})
        const fullPath=await UploadImage(validatedFile.image)
        const validatedLogo=validateWithZodSchema(imageSchema,{image:logo})
        const logoPath=await UploadImage(validatedLogo.image)
        const validatedPDF=validateWithZodSchema(fileSchema,{file:pdf})
        const pdfPath=await UploadFile(validatedPDF.file)
        await db.airline.create({
            data:{
                ...validatedFields,
                image:fullPath,
                logo:logoPath,
                profileId:user.id,
                file:pdfPath
            }
        })
      redirect('/airlines')
    } catch (error) {
        return renderError(error)
    }
  };
  

  export const createTourAction=async(
    prevState:any,
    formData:FormData
  ): Promise<{message:string}>=>{
    const user=await getAuthUser()
    try{
        const rawData=Object.fromEntries(formData)
        const file=formData.get('image') as File
        const pdf=formData.get('file') as File
        const validatedFields=validateWithZodSchema(tourSchema,rawData)
        const validatedFile=validateWithZodSchema(imageSchema,{image:file})
        const fullPath=await UploadImage(validatedFile.image)
        const validatedPDF=validateWithZodSchema(fileSchema,{file:pdf})
        const pdfPath=await UploadFile(validatedPDF.file)
        await db.tour.create({
            data:{
                ...validatedFields,
                image:fullPath,
                profileId:user.id,
                file:pdfPath
            }
        })
        redirect('/tours')
    }catch(error){
        return renderError(error)
    }
  }

  export const fetchProperties = async ({ search = '' }: { search?: string }) => {
    const properties = await db.property.findMany({
      where: {
        permit: 'Allowed', // Only fetch properties with "Allowed" permit
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        image: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return properties.map(property => ({
      ...property,
      type: 'property' as const, // Ensure 'type' remains a literal
    }));
  };
  
  
  export const fetchAirlines = async ({ search = '' }: { search?: string }) => {
    const airlines = await db.airline.findMany({
      where: {
        permit: 'Allowed', // Only fetch properties with "Allowed" permit
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        image: true,
      }
    });
  
    // Explicitly set the `type` as 'airline' (literal)
    return airlines.map(airline => ({
      ...airline,
      type: 'airline' as const, // Use 'as const' to ensure the literal type
    }));
  };
  
  export const fetchTours = async ({ search = '' }: { search?: string }) => {
    const tours = await db.tour.findMany({
      where: {
        permit: 'Allowed', // Only fetch properties with "Allowed" permit
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        image: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    // Explicitly set the `type` as 'tour' (literal)
    return tours.map(tour => ({
      ...tour,
      type: 'tour' as const, // Use 'as const' to ensure the literal type
    }));
  };

  export const fetchPendings = async () => {
    const pendingProperties = await db.property.findMany({
      where: { permit: "Pending" },
    });
  
    const pendingAirlines = await db.airline.findMany({
      where: { permit: "Pending" },
    });
  
    const pendingTours = await db.tour.findMany({
      where: { permit: "Pending" },
    });
  
    return {
      properties: pendingProperties.map(property => ({
        ...property,
        type: "property" as const,
      })),
      airlines: pendingAirlines.map(airline => ({
        ...airline,
        type: "airline" as const,
      })),
      tours: pendingTours.map(tour => ({
        ...tour,
        type: "tour" as const,
      })),
    };
  };
  

  export const fetchFavoriteId = async ({
    itemId,
    itemType,
  }: {
    itemId: string;
    itemType: "property" | "airline" | "tour";
  }) => {
    const user = await getAuthUser();
  
    const favorite = await db.favorite.findFirst({
      where: {
        profileId: user.id,
        ...(itemType === "property" && { propertyId: itemId }),
        ...(itemType === "airline" && { airlineId: itemId }),
        ...(itemType === "tour" && { tourId: itemId }),
      },
      select: {
        id: true,
      },
    });
  
    return favorite?.id || null;
  };
  
  export const toggleFavoriteAction = async (prevState: {
    itemId: string;
    favoriteId: string | null;
    itemType: "property" | "airline" | "tour";
    pathname: string;
  }) => {
    const user = await getAuthUser();
    const { itemId, favoriteId, itemType, pathname } = prevState;
  
    try {
      if (favoriteId) {
        await db.favorite.delete({
          where: {
            id: favoriteId,
          },
        });
      } else {
        await db.favorite.create({
          data:{
            profileId:user.id,
            ...(itemType === "property" && { propertyId: itemId }),
            ...(itemType === "airline" && { airlineId: itemId }),
            ...(itemType === "tour" && { tourId: itemId }),
          }
        });
      }
      revalidatePath(pathname)
      return{message:favoriteId?"Remove from Faves" : "Added to Faves"}
    } catch (error) {
      return renderError(error);
    }
  };
  
  export const fetchFavorites = async () => {
    const user = await getAuthUser();
  
    const favorites = await db.favorite.findMany({
      where: {
        profileId: user.id,
      },
      select: {
        property: {
          select: {
            id: true,
            name: true,
            tagline: true,
            image: true,
          },
        },
        airline: {
          select: {
            id: true,
            name: true,
            tagline: true,
            image: true,
          },
        },
        tour: {
          select: {
            id: true,
            name: true,
            tagline: true,
            image: true,
          },
        },
      },
    });
  
    return favorites
      .map((favorite) => {
        if (favorite.property) {
          return { ...favorite.property, type: 'property' as const };
        }
        if (favorite.airline) {
          return { ...favorite.airline, type: 'airline' as const };
        }
        if (favorite.tour) {
          return { ...favorite.tour, type: 'tour' as const };
        }
        return null;
      })
      .filter(
        (item): item is { id: string; name: string; image: string; tagline: string; type: 'property' | 'airline' | 'tour' } =>
          item !== null
      );
  };
  
  export const fetchMyProperties = async () => {
    const user = await getAuthUser();  // Ensure that we get the currently logged-in user
    
    // Query properties that the logged-in user has created (profileId matches user.id)
    const properties = await db.property.findMany({
      where: {
        profileId: user.id,  // Only fetch properties where the profileId matches the user's id
      },
      select: {
        id: true,
        name: true,
        tagline: true,
        image: true,
      },
      orderBy: {
        createdAt: 'desc',  // Order the properties by creation date, most recent first
      },
    });
  
    // Explicitly set the type as 'property' (literal)
    return {
      properties: properties.map(property => ({
        ...property,
        type: 'property' as const,  // Use 'as const' to ensure the literal type
      })),
      pathname: '/rentals',  // Include the pathname with '/rentals'
    };
};

export const fetchMyAirlines = async () => {
  const user = await getAuthUser();  
  

  const airlines = await db.airline.findMany({
    where: {
      profileId: user.id,  
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      image: true,
    },
    orderBy: {
      createdAt: 'desc',  
    },
  });

  return {
    airlines: airlines.map(airline => ({
      ...airline,
      type: 'airline' as const,  
    })),
    pathname: '/myairlines',  
  };
};

export const createRoomAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  
  try {
    // Extract raw data from formData
    const rawData = Object.fromEntries(formData);
    const file = formData.get('image') as File;

    const propertyId = rawData.propertyId as string;

    // Parse `quantity` and `guests` as integers
    const quantity = parseInt(rawData.quantity as string, 10);
    const guests = parseInt(rawData.guests as string, 10);

// Update `rawData` with parsed integers for quantity and guests
    const updatedRawData = {
      ...rawData,
      quantity, // Ensure quantity is an integer
      guests, // Ensure guests is an integer
    };

// Now validate with the updated raw data
    const validatedFields = validateWithZodSchema(roomSchema, updatedRawData);

    // Validate image file
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await UploadImage(validatedFile.image);

    // Create room in the database with validated data
    await db.room.create({
      data: {
        ...validatedFields,
        image: fullPath,
        propertyId
      },
    });
    redirect('/rentals')
  } catch (error) {
    return renderError(error); // Handle error
  }
};

export const createScheduleAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  
  const rawData = Object.fromEntries(formData);
  console.log(rawData)
  try {
    const airlineId = rawData.airlineId as string;

    // Validate fields with Zod schema
    const economyCount=parseInt(rawData.economyCount as string, 10);
    const businessCount=parseInt(rawData.businessCount as string, 10);
    const firstClassCount=parseInt(rawData.firstClassCount as string, 10);
    const updatedRawData = {
      ...rawData,
      economyCount, // Ensure quantity is an integer
      businessCount, // Ensure guests is an integer
      firstClassCount
    };
    
    const validatedFields = validateWithZodSchema(scheduleSchema, updatedRawData);
    // Create schedule in the database with validated data, similar to how `createRoomAction` works
    await db.schedule.create({
      data: {
        ...validatedFields,
        airlineId,
      },
    });
    redirect('/myairlines')
  } catch (error) {
    return renderError(error); // Handle error
  }
};


export const fetchPropertyDetails=async(id:string)=>{
  return db.property.findUnique({
    where:{
      id
    },
    include:{
      profile:true
    }
  })
}

export const fetchAirlineDetails=async(id:string)=>{
  return db.airline.findUnique({
    where:{
      id
    },
    include:{
      profile:true
    }
  })
}

export const fetchTourDetails=async(id:string)=>{
  return db.tour.findUnique({
    where:{
      id
    },
    include:{
      profile:true
    }
  })
}

export const fetchRooms = async ({
  propertyId,
  checkIn,
  checkOut,
  guests,
}: {
  propertyId: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}) => {
  // Fetch all rooms, optionally filter by propertyId
  const rooms = await db.room.findMany({
    where: {
      ...(propertyId && { propertyId }), // Filter by propertyId if provided
      ...(guests && { guests: { gte: guests } }), // Filter by guests if provided
    },
    select: {
      id: true,
      type: true,
      image: true,
      description: true,
      price: true,
      guests: true,
      quantity: true,
      beds: true,
      amenities: true,
      view: true,
      propertyId: true,
    },
    orderBy: {
      createdAt: 'desc', // Default order by newest
    },
  });

  // If no date range is provided, return the latest rooms
  if (!checkIn || !checkOut) {
    return rooms;
  }

  // Fetch bookings that overlap with the provided date range
  const overlappingBookings = await db.roomBooking.findMany({
    where: {
      AND: [
        { checkIn: { lt: checkOut } }, // Booking starts before the checkOut date
        { checkOut: { gt: checkIn } }, // Booking ends after the checkIn date
      ],
    },
    select: {
      roomId: true,
      totalNights: true,
    },
  });

  // Calculate room availability
  const roomAvailability = rooms.map((room) => {
    // Get all bookings for the current room
    const roomBookings = overlappingBookings.filter(
      (booking) => booking.roomId === room.id
    );

    // Calculate total booked quantity for the room
    const totalBooked = roomBookings.length;

    // Check if the room is still available based on quantity
    const isAvailable = totalBooked < room.quantity;

    return isAvailable ? room : null;
  });

  // Filter out unavailable rooms
  return roomAvailability.filter((room): room is RoomProps => room !== null);

};



export const createBookingAction = async (prevState: {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
}) => {
  const user = await getAuthUser();
  const { roomId, checkIn, checkOut } = prevState;
  const room = await db.room.findUnique({
    where: { id: roomId },
    select: { price: true },
  });
  if (!room) {
    return { message: "Room Not Found" };
  }
  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: room.price,
  });
  try {
    const booking=await db.roomBooking.create({
      data:{
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
        profileId:user.id,
        roomId
      }
    })
  } catch (error) {
    return renderError(error)
  }
  redirect('/bookings')
};

export const createAirlineBookingAction = async (prevState: {
  scheduleIds: string[];  // Multiple schedule IDs
  prices: number[];       // Multiple prices
  guests: number;         // Number of guests
  flightClass: string;    // "economy", "business", or "firstClass"
}) => {
  const user = await getAuthUser();
  const { scheduleIds, prices, guests, flightClass } = prevState;

  // Loop through the scheduleIds and prices if there are more than one
  for (let i = 0; i < scheduleIds.length; i++) {
    const scheduleId = scheduleIds[i];
    const price = prices[i];
    
    // Fetch the flight schedule from the database
    const flightSchedule = await db.schedule.findUnique({
      where: { id: scheduleId },
      select: { id: true, economyCount: true, businessCount: true, firstClassCount: true },
    });

    if (!flightSchedule) {
      return { message: "Flight Schedule Not Found" };
    }

    // Check for available seats based on the class
    let availableSeats = 0;
    if (flightClass === "economy") {
      availableSeats = flightSchedule.economyCount;
    } else if (flightClass === "business") {
      availableSeats = flightSchedule.businessCount;
    } else if (flightClass === "firstClass") {
      availableSeats = flightSchedule.firstClassCount;
    }

    // If there are not enough available seats, return an error
    if (availableSeats < guests) {
      return { message: `Not Enough Available Seats in ${flightClass} Class` };
    }

    // Calculate total for the booking
    const orderTotal = price * guests;

    try {
      // Create the airline booking
      await db.airBooking.create({
        data: {
          scheduleId,
          orderTotal,
          passengers: guests,
          profileId: user.id,
        },
      });

      // Update available seats based on the class
      if (flightClass === "economy") {
        await db.schedule.update({
          where: { id: scheduleId },
          data: {
            economyCount: flightSchedule.economyCount - guests,
          },
        });
      } else if (flightClass === "business") {
        await db.schedule.update({
          where: { id: scheduleId },
          data: {
            businessCount: flightSchedule.businessCount - guests,
          },
        });
      } else if (flightClass === "firstClass") {
        await db.schedule.update({
          where: { id: scheduleId },
          data: {
            firstClassCount: flightSchedule.firstClassCount - guests,
          },
        });
      }
    } catch (error) {
      return renderError(error);
    }
  }

  redirect('/airline-bookings');
};






export const fetchSchedules = async ({
  airlineId,
  travelDate,
  returnDate,
  guests = 1,
  class: travelClass,
  origin,
  destination,
}: {
  airlineId: string;
  travelDate?: Date;
  returnDate?: Date;
  guests?: number;
  class?: string;
  origin?: string;
  destination?: string;
}) => {
  const schedules = await db.schedule.findMany({
    where: {
      airlineId,
    },
    select: {
      id: true,
      flightCode: true,
      departureTime: true,
      arrivalTime: true,
      origin: true,
      destination: true,
      originAirport: true,
      destinationAirport: true,
      price: true,
      status: true,
      amenities: true,
      economyCount: true,
      businessCount: true,
      firstClassCount: true,
      airlineId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!travelDate && !returnDate && !travelClass && !origin && !destination) {
    return schedules;
  }


  const filterSchedules = (date: Date, origin?: string, destination?: string) => {
    return schedules.filter((schedule) => {
      const availableSeats =
        travelClass === "economy"
          ? schedule.economyCount
          : travelClass === "business"
          ? schedule.businessCount
          : schedule.firstClassCount;

      return (
        new Date(schedule.departureTime).toDateString() === date.toDateString() &&
        availableSeats >= guests &&
        (!origin || schedule.origin === origin) &&
        (!destination || schedule.destination === destination)
      );
    });
  };

  if (travelDate && !returnDate) {
    return filterSchedules(travelDate, origin, destination);
  }

  if (travelDate && returnDate) {
    const outboundSchedules = filterSchedules(travelDate, origin, destination);
    const returnSchedules = filterSchedules(returnDate, destination, origin); // Fix applied: swapped origin and destination

    const roundTripSchedules: {
      outbound: typeof schedules[number];
      returnTrip: typeof schedules[number];
    }[] = [];

    outboundSchedules.forEach((outbound) => {
      returnSchedules.forEach((returnTrip) => {
        if (
          outbound.origin === returnTrip.destination &&
          outbound.destination === returnTrip.origin
        ) {
          roundTripSchedules.push({ outbound, returnTrip });
        }
      });
    });

    return roundTripSchedules;
  }

  return [];
};

export const fetchRoomBookings = async () => {
  const user = await getAuthUser();
  const bookings = await db.roomBooking.findMany({
    where: {
      profileId: user.id,
    },
    include: {
      room: {
        select: {
          id: true,
          type: true,
          property: {
            select: {
              id:true,
              name: true, 
            },
          },
        },
      },
    },
    orderBy: {
      checkIn: 'desc',
    },
  });
  return bookings;
};

export const fetchAirBookings = async () => {
  const user = await getAuthUser();
  const bookings = await db.airBooking.findMany({
    where: {
      profileId: user.id,
    },
    include: {
      schedule: {
        select: {
          id: true,
          departureTime: true,
          arrivalTime:true,
          originAirport:true,
          destinationAirport:true,
          origin:true,
          destination:true,
          airline: {
            select: {
              id:true,
              name: true, 
            },
          },
        },
      },
    },
    orderBy: {
      schedule:{
        departureTime:'desc'
      }
    },
  });
  return bookings;
};


export async function deleteRoomBookingAction(prevState: { bookingId: string }) {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    const result = await db.roomBooking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath('/bookings');
    return { message: 'Booking deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
}

export async function deleteAirBookingAction(prevState: { bookingId: string }) {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    const result = await db.airBooking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath('/bookings');
    return { message: 'Booking deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
}

export const fetchRoomsRentals = async () => {
  const user = await getAuthUser();

  // Fetch the user's profile along with associated property IDs
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      properties: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!profile || profile.properties.length === 0) {
    return []
  }

  // Extract property IDs
  const propertyIds = profile.properties.map((property) => property.id);

  // Fetch rooms for all properties
  const rentals = await db.room.findMany({
    where: {
      propertyId: { in: propertyIds },
    },
    select: {
      id: true,
      type: true,
      price: true,
      propertyId:true
    },
  });

  // Fetch total nights and order total sums for each rental
  const rentalsWithBookingSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightsSum = await db.roomBooking.aggregate({
        where: {
          roomId: rental.id,
        },
        _sum: {
          totalNights: true,
        },
      });

      const orderTotalSum = await db.roomBooking.aggregate({
        where: {
          roomId: rental.id,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...rental,
        totalNightsSum: totalNightsSum._sum.totalNights || 0, // Ensure no undefined values
        orderTotalSum: orderTotalSum._sum.orderTotal || 0, // Ensure no undefined values
      };
    })
  );

  return rentalsWithBookingSums;
};

export const fetchSchedulesRentals = async () => {
  const user = await getAuthUser();

  // Fetch the user's profile along with associated property IDs
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      airlines: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!profile || profile.airlines.length === 0) {
    return []
  }

  // Extract property IDs
  const airlineIds = profile.airlines.map((airline) => airline.id);

  // Fetch rooms for all properties
  const rentals = await db.schedule.findMany({
    where: {
      airlineId: { in: airlineIds },
    },
    select: {
      id: true,
      flightCode: true,
      price: true,
    },
  });

  // Fetch total nights and order total sums for each rental
  const rentalsWithBookingSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalPassengersSum = await db.airBooking.aggregate({
        where: {
          scheduleId: rental.id,
        },
        _sum: {
          passengers: true,
        },
      });

      const orderTotalSum = await db.airBooking.aggregate({
        where: {
          scheduleId: rental.id,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...rental,
        totalPassengersSum: totalPassengersSum._sum.passengers || 0, // Ensure no undefined values
        orderTotalSum: orderTotalSum._sum.orderTotal || 0, // Ensure no undefined values
      };
    })
  );

  return rentalsWithBookingSums;
};


export async function deleteRoomAction(prevState: { roomId: string }) {
  const { roomId } = prevState;

  try {
    await db.room.delete({
      where: {
        id: roomId,
      },
    });

    revalidatePath('/rentals');
    return { message: 'Rental deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
}

export const fetchRoomDetails=async (roomId:string)=>{
  return db.room.findUnique({
    where:{
      id:roomId
    }
  })
}

export const fetchScheduleDetails=async (scheduleId:string)=>{
  return db.schedule.findUnique({
    where:{
      id:scheduleId
    }
  })
}

export const updateRoomAction=async(prevState:any, formData:FormData):Promise<{message:string}>=>{
  const roomId=formData.get('roomId') as string;
  const propertyId=formData.get('propertyId') as string
  try{
    const rawData=Object.fromEntries(formData)
    const quantity = parseInt(rawData.quantity as string, 10);
    const guests = parseInt(rawData.guests as string, 10);

// Update `rawData` with parsed integers for quantity and guests
    const updatedRawData = {
      ...rawData,
      quantity, // Ensure quantity is an integer
      guests, // Ensure guests is an integer
    };
    const validatedFields=validateWithZodSchema(roomSchema,updatedRawData)
    await db.room.update({
      where:{
        id:roomId
      },
      data:{
        ...validatedFields
      }
    })
    revalidatePath(`/rentals/${propertyId}/rooms/${roomId}/edit`)
    return{message:'Update Successful'}
  }catch(error){
    return renderError(error)
  }
}

export const updateRoomImageAction=async(prevState:any, formData:FormData):Promise<{message:string}>=>{
  const roomId=formData.get('id') as string;
  const propertyId=formData.get('pid') as string;

  try{
    const image=formData.get('image') as File
    const validatedFields=validateWithZodSchema(imageSchema,{image})
    const fullPath=await UploadImage(validatedFields.image)
    await db.room.update({
      where:{
        id:roomId
      },
      data:{
        image:fullPath
      }
    })
    revalidatePath(`/rentals/${propertyId}/rooms/${roomId}/edit`)
    revalidatePath(`/rentals/${propertyId}/rooms/${roomId}/edit`)
    return{message:'Image Updated Successfully'}
  }catch(error){
    return renderError(error)
  }
}

export const fetchStats=async()=>{
  await getAdminUser()
  const userCount=await db.profile.count()
  const propertiesCount=await db.property.count()
  const airlinesCount=await db.airline.count()
  const roomBookingsCount=await db.roomBooking.count()
  const airBookingsCount=await db.airBooking.count()
  const bookingsCount=roomBookingsCount+airBookingsCount
  return{
    userCount,
    propertiesCount,
    airlinesCount,
    bookingsCount
  }
}

export const fetchSalesDataDay = async () => {
  await getAdminUser();
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const thirtyDaysAgo = date;

  // Fetch Room and Airline bookings
  const roomSales = await db.roomBooking.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const airSales = await db.airBooking.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
  });

  // Combine both sales data
  const combinedSales = [...roomSales, ...airSales];

  // Process sales data
  let dailySales = combinedSales.reduce((total, current) => {
    const date = formatDate(current.createdAt, false); // Format as 'YYYY-MM-DD'

    const existingEntry = total.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.total += current.orderTotal;
    } else {
      total.push({ date, total: current.orderTotal });
    }
    return total;
  }, [] as Array<{ date: string; total: number }>);

  // **Sort the data in ascending order**
  dailySales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return dailySales;
};


export const fetchSalesDataMonth = async () => {
  await getAdminUser();
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  const roomSales = await db.roomBooking.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const airSales = await db.airBooking.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const combinedSales = [...roomSales, ...airSales];

  let monthlySales = combinedSales.reduce((total, current) => {
    const date = formatDate(current.createdAt, true); // 'YYYY-MM'

    const existingEntry = total.find((entry) => entry.date === date);
    if (existingEntry) {
      existingEntry.total += current.orderTotal;
    } else {
      total.push({ date, total: current.orderTotal });
    }
    return total;
  }, [] as Array<{ date: string; total: number }>);

  return monthlySales;
};

export const updatePending = async (id: string, type: "property" | "airline" | "tour") => {
  try {
    // Update permit status
    if (type === "property") {
      await db.property.update({ where: { id }, data: { permit: "Allowed" } });
    } else if (type === "airline") {
      await db.airline.update({ where: { id }, data: { permit: "Allowed" } });
    } else if (type === "tour") {
      await db.tour.update({ where: { id }, data: { permit: "Allowed" } });
    }

    
  } catch (error) {
    return renderError(error)
  }
  
};










  
  
  
  
  
  
  
  
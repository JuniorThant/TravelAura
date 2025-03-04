"use server"
import { airlineSchema, fileSchema, imageSchema, packageSchema, profileSchema, propertySchema, roomSchema, scheduleSchema, tourSchema, validateWithZodSchema } from "./schema"
import db from './db';
import {  clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UploadFile, UploadImage } from "./supabase";
import { calculateTotals, calculateTotalsAirline, calculateTotalsTour } from "./calculateTotals";
import { RoomProps } from "./types";
import { formatDate } from "./format";


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
            id: true,
            permit:true
          },
        },
      },
    });

    // Check if the user has any properties
    if (user?.properties && user.properties.some(property => property.permit === 'Allowed')) {
      return true; // The user has created at least one property
    }}
      return false; // The user hasn't created any property
    } catch (error) {
      console.error('Error checking properties:', error);
      return false; // Return false in case of an error
    }
  };

  export const hasTour=async(clerkId:string | null)=>{
    try {
      if(clerkId){
      const user = await db.profile.findUnique({
        where: {
          clerkId,
        },
        select: {
          tours: {
            select: {
              id: true, // Select the property ID
              permit:true
            },
          },
        },
      });
  
      // Check if the user has any properties
      if (user?.tours && user.tours.some(tour => tour.permit === 'Allowed')) {
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
              permit:true
            },
          },
        },
      });
  
      // Check if the user has any properties
      if (user?.airlines && user.airlines.some(airline => airline.permit === 'Allowed')) {
        return true; // The user has created at least one property
      }
    }
        return false; // The user hasn't created any property
      } catch (error) {
        console.error('Error checking properties:', error);
        return false; // Return false in case of an error
      }
    };

    export const fetchLowestPrice = async (id: string, type: 'property' | 'airline' | 'tour') => {
      try {
        let lowestPrice = null;
    
        if (type === 'property') {
          const room = await db.room.findFirst({
            where: { propertyId: id },
            orderBy: { price: 'asc' },
            select: { price: true }
          });
          lowestPrice = room?.price ?? null;
        } else if (type === 'airline') {
          const schedule = await db.schedule.findFirst({
            where: { airlineId: id },
            orderBy: { price: 'asc' },
            select: { price: true }
          });
          lowestPrice = schedule?.price ?? null;
        } else if (type === 'tour') {
          const tourPackage = await db.package.findFirst({
            where: { tourId: id },
            orderBy: { price: 'asc' },
            select: { price: true }
          });
          lowestPrice = tourPackage?.price ?? null;
        }
    
        return lowestPrice !== null ? `$${lowestPrice}` : '$200';
      } catch (error) {
        if (error && typeof error === 'object') {
          console.error('Error fetching lowest price:', error);
        } else {
          console.error('Error fetching lowest price: Unknown error');
        }
        return 'N/A'; // ✅ Always return a string instead of an object
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
    try{const user = await currentUser()
    if (!user) return null
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        },
        select: {
            profileImage: true
        }
    })

    return profile?.profileImage}catch(error){
      return null
    }
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
        revalidatePath('/')
        return{message:'Property registered successful, It will take 3 to 5 days to verify your property'}
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
    } catch (error) {
        return renderError(error)
    }
    redirect('/airlines')
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
    }catch(error){
        return renderError(error)
    }
    redirect('/tours')
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
        profileId: user.id, 
        permit:'Allowed'
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

export const fetchMyTours = async () => {
  const user = await getAuthUser();  
  

  const tours = await db.tour.findMany({
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
    tours: tours.map(tour => ({
      ...tour,
      type: 'tour' as const,  
    })),
    pathname: '/mytours',  
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

  } catch (error) {
    return renderError(error); // Handle error
  }
  redirect('/myairlines')
};

export const createPackageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  
  const rawData = Object.fromEntries(formData);
  const file=formData.get('image') as File
  try {
    const tourId = rawData.tourId as string;

    // Validate fields with Zod schema
    const maxGuests=parseInt(rawData.maxGuests as string, 10);
    const updatedRawData = {
      ...rawData,
      maxGuests
    };
    
    const validatedFields = validateWithZodSchema(packageSchema, updatedRawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    const fullPath = await UploadImage(validatedFile.image);
    // Create schedule in the database with validated data, similar to how `createRoomAction` works
    await db.package.create({
      data: {
        ...validatedFields,
        tourId,
        image:fullPath
      },
    });
    revalidatePath('/mytours')
    return{message:"package created successfully"}
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

export const fetchPackages=async({tourId}:{tourId:string})=>{
  const packages=await db.package.findMany({
    where:{
      tourId
    },
    orderBy:{
      createdAt:'desc'
    }
  })
  return packages
}

export const fetchRoomsById=async({roomId}:{roomId:string})=>{
  const rooms=await db.room.findMany({
    where:{
      id:roomId
    },
    select:{
      id: true,
      type: true,
      image: true,
      price: true,
      guests: true,
      quantity: true,
      beds: true,
      amenities: true,
      view: true,
      propertyId: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  })

  return rooms
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
  let bookingId: null | string = null;
  const { roomId, checkIn, checkOut } = prevState;
  
  // Check room availability
  const overlappingBookings = await db.roomBooking.findMany({
    where: {
      roomId,
      AND: [
        { checkIn: { lt: checkOut } }, // Booking starts before the checkOut date
        { checkOut: { gt: checkIn } }, // Booking ends after the checkIn date
      ],
    },
  });
  
  const room = await db.room.findUnique({
    where: { id: roomId },
    select: { price: true, quantity: true },
  });
  
  if (!room) {
    return { message: "Room Not Found" };
  }
  
  if (overlappingBookings.length >= room.quantity) {
    return { message: "Room is fully booked for the selected dates" };
  }
  
  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: room.price,
  });
  
  try {
    const booking = await db.roomBooking.create({
      data: {
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
        profileId: user.id,
        roomId,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }
  
  redirect(`/checkout?bookingId=${bookingId}&property=true`);
};

export const createAirlineBookingAction = async (prevState: {
  scheduleIds: string[];  // Multiple schedule IDs
  prices: number[];       // Multiple prices (per flight)
  guests: number;         // Number of guests
  flightClass: string;    // "economy", "business", or "firstClass"
}) => {
  const user = await getAuthUser();
  const { scheduleIds, prices, guests, flightClass } = prevState;

  let bookingIds: string[] = []; // ✅ Store multiple booking IDs

  for (let i = 0; i < scheduleIds.length; i++) {
    const scheduleId = scheduleIds[i];
    const price = prices[i];

    // Fetch the flight schedule from the database
    const flightSchedule = await db.schedule.findUnique({
      where: { id: scheduleId },
      select: {
        id: true,
        economyCount: true,
        businessCount: true,
        firstClassCount: true,
      },
    });

    if (!flightSchedule) {
      return { message: "Flight Schedule Not Found" };
    }

    // Determine available seats based on class
    let availableSeats =
      flightClass === "economy"
        ? flightSchedule.economyCount
        : flightClass === "business"
        ? flightSchedule.businessCount
        : flightSchedule.firstClassCount;

    // Check if there are enough available seats
    if (availableSeats < guests) {
      return { message: `Not Enough Available Seats in ${flightClass} Class` };
    }

    // Calculate total for the booking
    const { orderTotalAir } = calculateTotalsAirline({
      priceOneWay: price,
      guests: guests,
    });

    try {
      // Create the airline booking
      const booking = await db.airBooking.create({
        data: {
          scheduleId,
          orderTotal: orderTotalAir,
          passengers: guests,
          profileId: user.id,
        },
      });

      // Store the booking ID
      bookingIds.push(booking.id);

      // Update available seats in the database
      const seatField =
        flightClass === "economy"
          ? "economyCount"
          : flightClass === "business"
          ? "businessCount"
          : "firstClassCount";

      await db.schedule.update({
        where: { id: scheduleId },
        data: { [seatField]: availableSeats - guests },
      });
    } catch (error) {
      return { message: "Error Creating Booking", error };
    }
  }

  // ✅ Redirect with multiple booking IDs for Stripe payment
  redirect(`/checkout?bookingIds=${bookingIds.join(",")}&airline=true`);
};

export const createTourBookingAction = async (prevState: {
  packageId: string;
  pricePackage: number;
  guestsPackage: number;
}) => {
  const user = await getAuthUser();
  const { packageId, pricePackage, guestsPackage } = prevState;
  let bookingId:null|string=null

  // Calculate totals using provided function
  const { orderTotalPackage } = calculateTotalsTour({ pricePackage, guestsPackage });

  try {
    // Create the tour booking
    const booking=await db.tourBooking.create({
      data: {
        packageId,
        orderTotal: orderTotalPackage,
        passengers: guestsPackage,
        profileId: user.id,
      },
    });
    bookingId=booking.id
  } catch (error) {
    return renderError(error);
  }

  redirect(`/checkout?bookingId=${bookingId}&tour=true`)
};

export const fetchSchedulesByIds = async ({
  scheduleId,
  return: isRoundTrip,
}: {
  scheduleId: string;
  return: boolean;
}) => {
  const schedules = await db.schedule.findMany({
    where: {
      id: scheduleId,
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

  if (!schedules.length) return [];

  if (isRoundTrip) {
    const returnSchedules = await db.schedule.findMany({
      where: {
        origin: schedules[0]?.destination,
        destination: schedules[0]?.origin,
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

    return schedules.map((outbound) => {
      return returnSchedules.map((returnTrip) => ({ outbound, returnTrip }));
    }).flat();
  }

  return schedules;
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

  // Apply filters conditionally only if parameters are provided
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

  // Handle filtering based on travel date and other parameters
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

  // Fallback case when no travelDate or returnDate is set
  return schedules.filter((schedule) => {
    const availableSeats =
      travelClass === "economy"
        ? schedule.economyCount
        : travelClass === "business"
        ? schedule.businessCount
        : schedule.firstClassCount;

    return (
      availableSeats >= guests &&
      (!origin || schedule.origin === origin) &&
      (!destination || schedule.destination === destination)
    );
  });
};


export const fetchRoomBookings = async () => {
  const user = await getAuthUser();
  const bookings = await db.roomBooking.findMany({
    where: {
      profileId: user.id,
      paymentStatus:true
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

export const fetchTourBookings=async()=>{
  const user=await getAuthUser()
  const bookings=await db.tourBooking.findMany({
    where:{
      profileId:user.id,
      paymentStatus:true
    },
    include:{
      package:{
        select:{
          id:true,
          name:true,
          departureDate:true,
          arrivalDate:true,
        }
      }
    },
    orderBy:{
      package:{
        departureDate:'desc'
      }
    }
  })
  return bookings
}

export const fetchAirBookings = async () => {
  const user = await getAuthUser();
  const bookings = await db.airBooking.findMany({
    where: {
      profileId: user.id,
      paymentStatus:true
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
          name:true
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
      propertyId:true,
      property:{
        select:{
          id:true,
          name:true
        }
      }
    },
    orderBy:{
      property:{
        createdAt:'desc'
      }
    }
  });

  // Fetch total nights and order total sums for each rental
  const rentalsWithBookingSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightsSum = await db.roomBooking.aggregate({
        where: {
          roomId: rental.id,
          paymentStatus:true
        },
        _sum: {
          totalNights: true,
        },
      });

      const orderTotalSum = await db.roomBooking.aggregate({
        where: {
          roomId: rental.id,
          paymentStatus:true
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
          id: true
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
      origin:true,
      destination:true,
      airlineId:true,
      airline:{
        select:{
          id:true,
          name:true
        }
      }
    },
    orderBy:{
      airline:{
        createdAt:'desc'
      }
    }
  });

  // Fetch total nights and order total sums for each rental
  const rentalsWithBookingSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalPassengersSum = await db.airBooking.aggregate({
        where: {
          scheduleId: rental.id,
          paymentStatus:true
        },
        _sum: {
          passengers: true,
        },
      });

      const orderTotalSum = await db.airBooking.aggregate({
        where: {
          scheduleId: rental.id,
          paymentStatus:true
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

export const fetchPackageRentals = async () => {
  const user = await getAuthUser();

  // Fetch the user's profile along with associated tour IDs
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      tours: {
        select: {
          id: true
        },
      },
    },
  });

  if (!profile || profile.tours.length === 0) {
    return [];
  }

  // Extract tour IDs
  const tourIds = profile.tours.map((tour) => tour.id);

  // Fetch packages for all tours
  const packages = await db.package.findMany({
    where: {
      tourId: { in: tourIds },
    },
    select: {
      id: true,
      name: true,
      price: true,
      maxGuests: true,
      departureDate: true,
      arrivalDate: true,
      tourId: true,
      tour:{
        select:{
          id:true,
          name:true
        }
      }
    },
    orderBy:{
      tour:{
        createdAt:'desc'
      }
    }
  });

  // Fetch total guests and order total sums for each package
  const packagesWithBookingSums = await Promise.all(
    packages.map(async (pkg) => {
      const totalGuestsSum = await db.tourBooking.aggregate({
        where: {
          packageId: pkg.id,
          paymentStatus:true
        },
        _sum: {
          passengers: true,
        },
      });

      const orderTotalSum = await db.tourBooking.aggregate({
        where: {
          packageId: pkg.id,
          paymentStatus:true
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...pkg,
        totalGuestsSum: totalGuestsSum._sum.passengers || 0, // Ensure no undefined values
        orderTotalSum: orderTotalSum._sum.orderTotal || 0, // Ensure no undefined values
      };
    })
  );

  return packagesWithBookingSums;
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

export async function deleteScheduleAction(prevState: { scheduleId: string }) {
  const { scheduleId } = prevState;

  try {
    await db.schedule.delete({
      where: {
        id: scheduleId,
      },
    });

    revalidatePath('/myairlines');
    return { message: 'Schedule deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
}

export async function deletePackageAction(prevState: { packageId: string }) {
  const { packageId } = prevState;

  try {
    await db.package.delete({
      where: {
        id: packageId,
      },
    });

    revalidatePath('/mytours');
    return { message: 'Package deleted successfully' };
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

export const fetchPackageDetails=async (packageId:string)=>{
  return db.package.findUnique({
    where:{
      id:packageId
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

export const updatePackageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  
  const rawData = Object.fromEntries(formData);
  console.log(rawData)
  try {
    const packageId=formData.get('packageId') as string
    const tourId = rawData.tourId as string;
    const departureDate=rawData.departureTime as string;
    const arrivalDate=rawData.arrivalTime as string;

    const maxGuests=parseInt(rawData.maxGuests as string, 10);
    const updatedRawData = {
      ...rawData,
      departureDate,
      arrivalDate,
      maxGuests
    };
    
    const validatedFields = validateWithZodSchema(packageSchema, updatedRawData);
    await db.package.update({
      where:{
        id:packageId
      },
      data: {
        ...validatedFields,
        tourId
      },
    });
    revalidatePath(`/mytours/${tourId}/packages/${packageId}/edit`)
    return{message:'Update Successful'}
  } catch (error) {
    console.log(error)
    return renderError(error)
  }
};

export const updateSchedule = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  
  const rawData = Object.fromEntries(formData);
  const airlineId=formData.get('airlineId') as string;
  const scheduleId=formData.get('scheduleId') as string
  console.log(rawData)
  try {

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
    await db.schedule.update({
      where:{
        id:scheduleId
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/myairlines/${airlineId}/schedules/${scheduleId}/edit`)
    return{message:'Update Successful'}
  } catch (error) {
    return renderError(error); // Handle error
  }
};

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

export const updatePackageImageAction=async(prevState:any, formData:FormData):Promise<{message:string}>=>{
  const packageId=formData.get('id') as string;
  const tourId=formData.get('tid') as string;

  try{
    const image=formData.get('image') as File
    const validatedFields=validateWithZodSchema(imageSchema,{image})
    const fullPath=await UploadImage(validatedFields.image)
    await db.package.update({
      where:{
        id:packageId
      },
      data:{
        image:fullPath
      }
    })
    revalidatePath(`/rentals/${tourId}/rooms/${packageId}/edit`)
    revalidatePath(`/rentals/${tourId}/rooms/${packageId}/edit`)
    return{message:'Image Updated Successfully'}
  }catch(error){
    return renderError(error)
  }
}

export const fetchStats = async () => {
  await getAdminUser();
  const userCount = await db.profile.count();
  const propertiesCount = await db.property.count();
  const airlinesCount = await db.airline.count();
  const toursCount=await db.tour.count()
  const roomBookingsCount = await db.roomBooking.count({where:{paymentStatus:true}});
  const airBookingsCount = await db.airBooking.count({where:{paymentStatus:true}});
  const tourBookingsCount = await db.tourBooking.count({where:{paymentStatus:true}});
  const bookingsCount = roomBookingsCount + airBookingsCount + tourBookingsCount;

  // Calculate total income from all bookings
  const roomIncome = (await db.roomBooking.aggregate({ where:{paymentStatus:true},_sum: { orderTotal: true } }))._sum.orderTotal || 0;
  const airIncome = (await db.airBooking.aggregate({ where:{paymentStatus:true},_sum: { orderTotal: true } }))._sum.orderTotal || 0;
  const tourIncome = (await db.tourBooking.aggregate({ where:{paymentStatus:true},_sum: { orderTotal: true } }))._sum.orderTotal || 0;

  const totalIncome = roomIncome + airIncome + tourIncome;

  return {
    userCount,
    propertiesCount,
    airlinesCount,
    toursCount,
    bookingsCount,
    totalIncome, // Added total income
  };
};

export const fetchReserveStats = async (serviceType:string,profileId:string) => {

  const roomsCount = await db.room.count({where:{property:{profileId:profileId}}});
  const schedulesCount = await db.schedule.count({where:{airline:{profileId:profileId}}});
  const packagesCount=await db.package.count({where:{tour:{profileId:profileId}}});
  const roomBookingsCount = await db.roomBooking.count({where:{paymentStatus:true,room:{property:{profileId:profileId}}}});
  const airBookingsCount = await db.airBooking.count({where:{paymentStatus:true,schedule:{airline:{profileId:profileId}}}});
  const tourBookingsCount = await db.tourBooking.count({where:{paymentStatus:true,package:{tour:{profileId:profileId}}}});

  const roomIncome = (await db.roomBooking.aggregate({
    where: {paymentStatus:true,room:{property:{profileId:profileId}}}, 
    _sum: { orderTotal: true }
  }))._sum.orderTotal || 0;
  
  const airIncome = (await db.airBooking.aggregate({ where:{paymentStatus:true,schedule:{airline:{profileId:profileId}}},_sum: { orderTotal: true } }))._sum.orderTotal || 0;
  const tourIncome = (await db.tourBooking.aggregate({ where:{paymentStatus:true,package:{tour:{profileId:profileId}}},_sum: { orderTotal: true } }))._sum.orderTotal || 0;

  if(serviceType==="property"){
    return{roomsCount,roomBookingsCount,roomIncome}
  }else if(serviceType==="airline"){
    return{schedulesCount,airBookingsCount,airIncome}
  }else if(serviceType==="tour"){
    return{packagesCount,tourBookingsCount,tourIncome}
  }
};


export const fetchSalesDataDay = async () => {
  await getAdminUser();
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const thirtyDaysAgo = date;

  // Fetch Room, Airline, and Tour bookings
  const roomSales = await db.roomBooking.findMany({
    where: { paymentStatus:true,createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const airSales = await db.airBooking.findMany({
    where: { paymentStatus:true,createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const tourSales = await db.tourBooking.findMany({
    where: { paymentStatus:true,createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
  });

  // Combine all sales data
  const combinedSales = [...roomSales, ...airSales, ...tourSales];

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

  // Sort the data in ascending order
  dailySales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return dailySales;
};

export const fetchSalesDataMonth = async () => {
  await getAdminUser();
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  // Fetch Room, Airline, and Tour bookings
  const roomSales = await db.roomBooking.findMany({
    where: { paymentStatus:true,createdAt: { gte: sixMonthsAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const airSales = await db.airBooking.findMany({
    where: { paymentStatus:true,createdAt: { gte: sixMonthsAgo } },
    orderBy: { createdAt: 'asc' },
  });

  const tourSales = await db.tourBooking.findMany({
    where: { paymentStatus:true,createdAt: { gte: sixMonthsAgo } },
    orderBy: { createdAt: 'asc' },
  });

  // Combine all sales data
  const combinedSales = [...roomSales, ...airSales, ...tourSales];

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


export const updatePropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user=await getAuthUser()
  try{
    const rawData=Object.fromEntries(formData)
    const propertyId=formData.get('propertyId') as string

      const validatedFields=validateWithZodSchema(propertySchema,rawData)
      await db.property.update({
        where:{
          id:propertyId
        },
          data:{
              ...validatedFields,
              profileId:user.id,
              permit:"Pending"
          }
      })
      revalidatePath(`/rentals/${propertyId}/edit`)
      return{message:'Update Successful'}
  }catch(error){
      return renderError(error)
  }
}

export const updateAirlineAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user=await getAuthUser()
  const rawData=Object.fromEntries(formData)
  try{
    const airlineId=formData.get('airlineId') as string
      const validatedFields=validateWithZodSchema(airlineSchema,rawData)
      await db.airline.update({
        where:{
          id:airlineId
        },
          data:{
              ...validatedFields,
              profileId:user.id,
          }
      })
      revalidatePath(`/myairlines/${airlineId}/edit`)
      return{message:'Update Successful'}
  } catch (error) {
      return renderError(error)
  }
};


export const updateTourAction=async(
  prevState:any,
  formData:FormData
): Promise<{message:string}>=>{
  const user=await getAuthUser()
  try{
      const rawData=Object.fromEntries(formData)
      const tourId=formData.get('tourId') as string
      const validatedFields=validateWithZodSchema(tourSchema,rawData)
      await db.tour.update({
        where:{
          id:tourId
        },
          data:{
              ...validatedFields,
              profileId:user.id,
          }
      })
      revalidatePath(`/mytours/${tourId}/edit`)
      return{message:'Update Successful'}
  }catch(error){
      return renderError(error)
  }
}

export const updatePropertyImageAction=async(prevState:any, formData:FormData):Promise<{message:string}>=>{

  const propertyId=formData.get('pid') as string;

  try{
    const image=formData.get('image') as File
    const validatedFields=validateWithZodSchema(imageSchema,{image})
    const fullPath=await UploadImage(validatedFields.image)
    await db.property.update({
      where:{
        id:propertyId
      },
      data:{
        image:fullPath,
        permit:"Pending"
      }
    })
    revalidatePath(`/rentals/${propertyId}/edit`)
    revalidatePath(`/rentals/${propertyId}/edit`)
    return{message:'Image Updated Successfully'}
  }catch(error){
    return renderError(error)
  }
}

export const updateAirlineImageAction=async(prevState:any, formData:FormData):Promise<{message:string}>=>{

  const airlineId=formData.get('airlineId') as string;

  try{
    const image=formData.get('image') as File
    const validatedFields=validateWithZodSchema(imageSchema,{image})
    const fullPath=await UploadImage(validatedFields.image)
    const logo=formData.get('logo') as File
    const validatedFile=validateWithZodSchema(imageSchema,{image:logo})
    const logoPath=await UploadImage(validatedFile.image)
    await db.airline.update({
      where:{
        id:airlineId
      },
      data:{
        image:fullPath,
        logo:logoPath,
        permit:"Pending"
      }
    })
    revalidatePath(`/myairlines/${airlineId}/edit`)
    revalidatePath(`/myairlines/${airlineId}/edit`)
    return{message:'Image Updated Successfully'}
  }catch(error){
    return renderError(error)
  }
}







  
  
  
  
  
  
  
  
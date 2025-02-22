import * as z from 'zod'
import { ZodSchema } from 'zod'

export const profileSchema = z.object({
    firstName: z.string().min(2, {
      message: 'First name must be at least two characters',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least two characters',
    }),
    username: z.string().min(2, {
      message: 'Username must be at least two characters',
    })
  });
  

export function validateWithZodSchema<T>(schema:ZodSchema<T>,data:unknown):T{
    const result = schema.safeParse(data)

        if(!result.success){
            const errors=result.error.errors.map((error)=>error.message)
            throw new Error(errors.join(','))
        }
    return result.data
}

export const imageSchema=z.object({
    image:validateFile()
})

export const fileSchema=z.object({
  file:validatePDF()
})

function validateFile() {
  const maxUploadSize = 100 * 1024 * 1024; // 100MB
  const acceptedFilesType = ['image/']; // Accepts any image type

  return z
      .instanceof(File)
      .refine((file) => {
          return !file || file.size <= maxUploadSize;
      }, 'File size must be less than 100 MB')
      .refine((file) => {
          return (
              !file || acceptedFilesType.some((type) => file.type.startsWith(type))
          );
      }, "File must be an image");
}


function validatePDF() {
  const maxUploadSize = 100 * 1024 * 1024; // 100MB
  return z
    .instanceof(File)
    .refine((file) => file.size <= maxUploadSize, 'File size must be less than 100 MB')
    .refine((file) => file.type === 'application/pdf', 'File must be a PDF');
}



export const propertySchema = z.object({
    name: z
      .string()
      .min(2, {
        message: 'name must be at least 2 characters.',
      })
      .max(100, {
        message: 'name must be less than 100 characters.',
      }),
    tagline: z
      .string()
      .min(2, {
        message: 'tagline must be at least 2 characters.',
      })
      .max(100, {
        message: 'tagline must be less than 100 characters.',
      }),
    category: z.string(),
    description: z.string().refine(
      (description) => {
        const wordCount = description.split(' ').length;
        return wordCount >= 1 && wordCount <= 1000;
      },
      {
        message: 'description must be between 1 and 1000 words.',
      }
    ),
    address: z
      .string()
      .min(2, {
        message: 'name must be at least 2 characters.',
      })
      .max(100, {
        message: 'name must be less than 100 characters.',
      }),
      amenities: z.string(),
  });


  export const airlineSchema = z.object({
    name: z
      .string()
      .max(100, {
        message: 'name must be less than 100 characters.',
      }),
    tagline: z
      .string()
      .max(100, {
        message: 'tagline must be less than 100 characters.',
      }),
    description: z.string().refine(
      (description) => {
        const wordCount = description.split(' ').length;
        return wordCount >= 1 && wordCount <= 1000;
      },
      {
        message: 'description must be between 1 and 1000 words.',
      }
    )
  });

  export const tourSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: 'name must be at least 2 characters.',
      })
      .max(100, {
        message: 'name must be less than 100 characters.',
      }),
    tagline: z
      .string()
      .min(2, {
        message: 'tagline must be at least 2 characters.',
      })
      .max(100, {
        message: 'tagline must be less than 100 characters.',
      }),
    description: z.string().refine(
      (description) => {
        const wordCount = description.split(' ').length;
        return wordCount >= 1 && wordCount <= 1000;
      },
      {
        message: 'description must be between 1 and 1000 words.',
      }
    ),
    address: z
      .string()
      .min(2, {
        message: 'name must be at least 2 characters.',
      })
      .max(100, {
        message: 'name must be less than 100 characters.',
      }),
  });

  export const roomSchema = z.object({
    id: z.string().uuid().optional(), // UUID is automatically generated, so it's optional for creation
    type: z
      .string()
      .min(1, { message: 'Room type is required and cannot be empty.' }),
      price: z.coerce.number().int().min(0, {
        message: 'price must be a positive number.',
      }),
    guests: z
      .number()
      .int()
      .positive({ message: 'Guests must be a positive integer.' }),
    quantity: z
      .number()
      .int()
      .nonnegative({ message: 'Quantity must be zero or a positive integer.' }),
    beds: z
      .string()
      .min(1, { message: 'Beds information is required and cannot be empty.' }),
      amenities: z.string(),
    view: z
      .string()
      .min(1, { message: 'View field is required and cannot be empty.' }),
  });
  

export const scheduleSchema = z.object({
  id: z.string().uuid().optional(), // UUID is automatically generated, so it's optional for creation
  flightCode: z
    .string()
    .min(1, { message: 'Flight code is required and cannot be empty.' }),
  departureTime: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid departure time. Must be a valid date string.',
    }),
  arrivalTime: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid arrival time. Must be a valid date string.',
    }),
  origin: z
    .string()
    .min(1, { message: 'Origin is required and cannot be empty.' }),
  destination: z
    .string()
    .min(1, { message: 'Destination is required and cannot be empty.' }),
  originAirport: z
    .string()
    .min(1, { message: 'Origin airport is required and cannot be empty.' }),
  destinationAirport: z
    .string()
    .min(1, { message: 'Destination airport is required and cannot be empty.' }),
  price: z.coerce.number().int().min(0, {
    message: 'Price must be a positive number.',
  }),
  status: z
    .string()
    .min(1, { message: 'Status is required and cannot be empty.' }),
  amenities: z.string(), 
  economyCount: z
      .number()
      .int()
      .nonnegative({ message: 'Economy Count must be zero or a positive integer.' }),
  businessCount: z
      .number()
      .int()
      .nonnegative({ message: 'Business Count must be zero or a positive integer.' }),
  firstClassCount: z
      .number()
      .int()
      .nonnegative({ message: 'First Class Count must be zero or a positive integer.' }),
});

export const packageSchema = z.object({
  id: z.string().uuid().optional(), // UUID is automatically generated, so it's optional for creation
  name: z
    .string()
    .min(1, { message: 'Package name is required and cannot be empty.' }),
  description: z
    .string()
    .min(10, { message: 'Description is required and cannot be empty' }),
    itinerary: z
    .string()
    .min(1, { message: 'Itinerary is required and cannot be empty' }),
    price: z.coerce.number().int().min(0, {
      message: 'price must be a positive number.',
    }),
  maxGuests: z
    .number()
    .int()
    .positive({ message: 'Guests must be a positive integer.' }),
    departureDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid departure date. Must be a valid date string.',
    }),
  arrivalDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid arrival date. Must be a valid date string.',
    }),
});
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    let databaseResponse = '';

    const keywordsProperty = ['properties', 'property', 'hotels', 'hotel','stays','stay'];
    const keywordsAirline = ['airline', 'flight', 'airlines', 'flights','fly'];
    const keywordsTour = ['tours', 'tour', 'trips', 'trip','travel'];
    const keywordsRoom = ['rooms', 'room', 'live', 'nights','stays','stay'];
    const keywordsSchedule = ['schedules', 'schedule', 'flight schedule', 'airline schedule','fly'];
    const keywordsPackage = ['packages', 'package', 'travel', 'trips','trip','travel'];

    if (keywordsProperty.some(keyword => message.toLowerCase().includes(keyword))) {
      // Check if user is searching for a specific amenity (e.g., kayaking)
      const amenityMatch = message.match(/properties.*with\s([\w\s]+)/i);
      const amenityQuery = amenityMatch ? amenityMatch[1].trim() : null;

      const properties = await prisma.property.findMany({
        where: amenityQuery ? { amenities: { contains: amenityQuery, mode: 'insensitive' } } : {},
        select: {
          name: true,
          tagline: true,
          category: true,
          image: true,
          address: true,
          description: true,
          amenities: true,
        },
      });

      databaseResponse = properties.length
        ? `Here are some properties${amenityQuery ? ` with ${amenityQuery}` : ''}: ` +
          properties.map(p => `${p.name} (${p.category}) - ${p.address}. Amenities: ${p.amenities}`).join('. ')
        : `No properties found${amenityQuery ? ` with ${amenityQuery}` : ''}.`;
    } 

    else if (keywordsAirline.some(keyword => message.toLowerCase().includes(keyword))) {
      const airlines = await prisma.airline.findMany();
      databaseResponse = airlines.length
        ? `Available airlines: ` + airlines.map(a => `${a.name} - ${a.tagline}`).join(', ')
        : 'No airlines available.';
    } 

    else if (keywordsTour.some(keyword => message.toLowerCase().includes(keyword))) {
      const tours = await prisma.tour.findMany();
      databaseResponse = tours.length
        ? `Available tours: ` + tours.map(t => `${t.name} - ${t.address}`).join(', ')
        : 'No tours available.';
    } 

    else if (keywordsRoom.some(keyword => message.toLowerCase().includes(keyword))) {
      const amenityMatch = message.match(/rooms.*with\s([\w\s]+)/i);
      const amenityQuery = amenityMatch ? amenityMatch[1].trim() : null;

      const rooms = await prisma.room.findMany({
        where: amenityQuery ? { amenities: { contains: amenityQuery, mode: 'insensitive' } } : {},
        select: {
          type: true,
          price: true,
          guests: true,
          quantity: true,
          beds: true,
          amenities: true,
          view: true,
        },
      });

      databaseResponse = rooms.length
        ? `Here are some rooms${amenityQuery ? ` with ${amenityQuery}` : ''}: ` +
          rooms.map(r => `${r.type}, Price: $${r.price}, Guests: ${r.guests}, Beds: ${r.beds}, View: ${r.view}. Amenities: ${r.amenities}`).join('. ')
        : `No rooms found${amenityQuery ? ` with ${amenityQuery}` : ''}.`;
    } 

    else if (keywordsSchedule.some(keyword => message.toLowerCase().includes(keyword))) {
      const schedules = await prisma.schedule.findMany();
      databaseResponse = schedules.length
        ? `Flight schedules: ` +
          schedules.map(s => `${s.flightCode} from ${s.origin} to ${s.destination}, Departure: ${s.departureTime}, Arrival: ${s.arrivalTime}`).join('. ')
        : 'No flight schedules found.';
    }

    else if (keywordsPackage.some(keyword => message.toLowerCase().includes(keyword))) {
      const packages = await prisma.package.findMany();
      databaseResponse = packages.length
        ? `Available packages: ` + packages.map(p => `${p.name}, Price: $${p.price}, Max Guests: ${p.maxGuests}`).join('. ')
        : 'No packages available.';
    }

    // Constructing AI response with database information
    const websiteInfo = `
      The Travel Aura platform provides various travel-related services, including hotel bookings,room details, airline reservations, and tour packages.
      Here is relevant database information based on your query: Don't say like as an AI model!!
      ${databaseResponse}
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: websiteInfo },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I am unable to respond.';
    res.status(200).json({ reply });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  } finally {
    await prisma.$disconnect();
  }
}

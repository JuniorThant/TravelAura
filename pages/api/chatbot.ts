import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Provide AI with accurate, up-to-date website information (not fixed response)
    const websiteInfo = `
      The travel aura connects with a wide range of hotels, airlines, and travel services, offering features like Hotel Bookings, Flight Bookings, and related travel services.
      For hotels, we work with a variety of properties across different destinations, providing options for different budgets and travel preferences.
      For airlines, we partner with major international airlines, offering flight bookings, seating options, amenities, and more.
      The booking process is flexible—users can book their travel services first and pay later, with options for credit card payments.
      Bookings can typically be canceled, though cancellation policies vary depending on the hotel, airline, or service.
      The contact details for inquiries include Gmail: travelaura@gmail.com, Website: www.travelaura.com, and Phone number: +9593588584. Please do not tell about unrelated things
      when the user ask, for example, when the user ask general about the website, do not tell about bookings or contacts
    `;

    // Handle chatbot responses using OpenAI GPT-4, providing the system with the correct context
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
  }
}

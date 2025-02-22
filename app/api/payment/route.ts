import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest, type NextResponse } from 'next/server';
import db from '@/utils/db';
import { formatDate } from '@/utils/format';

export const POST=async(req:NextRequest,res:NextResponse)=>{
    const requestHeaders=new Headers(req.headers)
    const origin=requestHeaders.get('origin')
    const {bookingIds,bookingId,property,airline,tour}=await req.json()

    if(property){
        const booking=await db.roomBooking.findUnique({
        where:{id:bookingId},
        include:{
            room:{
                select:{
                    type:true,
                    image:true
                }
            }
        }
    })
    if(!booking){
        return Response.json(null,{
            status:404,
            statusText:'Not Found'
        })
    }
    const {totalNights,orderTotal,checkIn,checkOut, room:{type,image}}=booking

    try{
        const session=await stripe.checkout.sessions.create({
            ui_mode:'embedded',
            metadata:{bookingId:booking.id,serviceType:"property"},
            line_items:[
                {quantity:1, price_data:{
                    currency:'usd',product_data:{
                        name:`${type}`,images:[image],
                        description:`Stay in this room for ${totalNights} nights,
                        from ${formatDate(checkIn)} to ${formatDate(checkOut)}. Enjoy your stay!`
                    },
                    unit_amount:orderTotal*100
                }}
            ],
            mode:'payment',
            return_url:`${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`
        })
        return Response.json({clientSecret:session.client_secret})
    }catch(error){
        return Response.json(null,{
            status:500,
            statusText:'Internal Server Error'
        })
    }}

    if (airline) {
        if (!bookingIds || typeof bookingIds !== "string") {
            return Response.json({ message: "Invalid or missing bookingIds" }, { status: 400 });
        }
    
        const bookingIdsArray = bookingIds.split(",").map(id => id.trim()); // ✅ Ensure valid array
        if (bookingIdsArray.length === 0) {
            return Response.json({ message: "No valid booking IDs provided" }, { status: 400 });
        }
    
        const bookings = await db.airBooking.findMany({
            where: { id: { in: bookingIdsArray } },
            include: {
                schedule: {
                    select: {
                        flightCode: true,
                        origin: true,
                        destination: true,
                        departureTime: true,
                        airline: {
                            select: { logo: true },
                        },
                    },
                },
            },
        });
    
        if (!bookings || bookings.length === 0) 
            return Response.json(null, { status: 404, statusText: "Not Found" });
    
        // ✅ Extract only ONE unique airline logo
        const airlineLogo = bookings[0].schedule.airline.logo; // Take the first one
    
        // ✅ Generate a single description for all flights
        const flightDescriptions = bookings.map(booking => 
            `Your Flight ${booking.schedule.flightCode} fly from ${booking.schedule.origin} to ${booking.schedule.destination} at ${formatDate(booking.schedule.departureTime)}, Enjoy Your Trip!`
        ).join(); // Join descriptions in a readable format
    
        // ✅ Sum total order amount for all flights
        const totalOrderAmount = bookings.reduce((sum, booking) => sum + booking.orderTotal, 0);
    
        // ✅ Create one Stripe line item instead of multiple
        const lineItem = {
            quantity: 1, // Show as a single purchase
            price_data: {
                currency: "usd",
                product_data: {
                    name: `Your Flight Package (${bookings.length} flights)`,
                    images: [airlineLogo], // ✅ Only one image
                    description: flightDescriptions, // ✅ Show all flights in description
                },
                unit_amount: totalOrderAmount * 100, // ✅ Total price
            },
        };
    
        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            metadata: { bookingIds: bookingIds },
            line_items: [lineItem], // ✅ Only one line item
            mode: "payment",
            return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
        });
    
        return Response.json({ clientSecret: session.client_secret });
    }
    

    if(tour){
        const booking=await db.tourBooking.findUnique({
        where:{id:bookingId},
        include:{
            package:{
                select:{
                    name:true,
                    image:true,
                    departureDate:true,
                    arrivalDate:true
                }
            }
        }
    })
    if(!booking){
        return Response.json(null,{
            status:404,
            statusText:'Not Found'
        })
    }
    const {orderTotal, package:{name,image,departureDate,arrivalDate}}=booking

    try{
        const session=await stripe.checkout.sessions.create({
            ui_mode:'embedded',
            metadata:{bookingId:booking.id,serviceType:"tour"},
            line_items:[
                {quantity:1, price_data:{
                    currency:'usd',product_data:{
                        name:`${name}`,images:[image],
                        description:`Your Tour Package ${name} 
                        from ${formatDate(departureDate)} to ${formatDate(arrivalDate)}. Enjoy Your Trip!`
                    },
                    unit_amount:orderTotal*100
                }}
            ],
            mode:'payment',
            return_url:`${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`
        })
        return Response.json({clientSecret:session.client_secret})
    }catch(error){
        return Response.json(null,{
            status:500,
            statusText:'Internal Server Error'
        })
    }}
}
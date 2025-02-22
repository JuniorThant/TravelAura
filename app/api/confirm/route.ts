import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from 'next/navigation';

import { type NextRequest, type NextResponse } from 'next/server';
import db from '@/utils/db';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id') as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // console.log(session);

    const bookingId = session.metadata?.bookingId;
    const serviceType = session.metadata?.serviceType;
    const bookingIds=session.metadata?.bookingIds;
    if (bookingIds) {
        const bookingIdsArray = bookingIds.split(",").map(id => id.trim());
  
        // Update each booking in the array
        if (session.status === 'complete') {
          for (const id of bookingIdsArray) {
            await db.airBooking.update({
              where: { id },
              data: { paymentStatus: true },
            });
          }
        }
      }
      if(bookingId && serviceType=="property"){
        if(session.status==='complete'){
            await db.roomBooking.update({
                where:{id:bookingId},
                data:{paymentStatus:true}
            })
        }
      }
      if(bookingId && serviceType=="tour"){
        if(session.status==='complete'){
            await db.tourBooking.update({
                where:{id:bookingId},
                data:{paymentStatus:true}
            })
        }
      }
  } catch (err) {
    console.log(err);
    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
  redirect('/bookings');
};
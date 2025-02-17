import { calculateTotals, calculateTotalsAirline } from "@/utils/calculateTotals";
import { formatCurrency } from "@/utils/format";
import { useAirline, useAirlineBooking, useRoom } from "@/utils/store";
import { Card, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export default function BookingForm() {
    const { range, price, roomId } = useRoom((state) => state);
    const checkIn = range?.from as Date;
    const checkOut = range?.to as Date;
    const totals = roomId ? calculateTotals({ checkIn, checkOut, price }) : null;
    const { totalNights, subTotal, environment, tax, orderTotal } = totals || {};
    const {guests}=useAirline((state)=>state)
    console.log(guests)
    
    const { scheduleIds, prices } = useAirlineBooking((state) => state);
    
    const priceOneWay = prices[0] || 0;
    const priceReturn = prices[1] || 0;
    const { subTotalAir, taxAir, orderTotalAir } = calculateTotalsAirline({ priceOneWay, priceReturn, guests });

    if (price) {
        return (
            <Card className='p-2 mb-2'>
                <CardTitle className="mb-8">Summary</CardTitle>
                <FormRow label={`$${price} x ${totalNights} nights`} amount={subTotal} />
                <FormRow label="Environment Fee" amount={environment} />
                <FormRow label="VAT" amount={tax} />
                <Separator className="mt-4" />
                <CardTitle className="mt-8">
                    <FormRow label="Booking Total" amount={orderTotal} />
                </CardTitle>
            </Card>
        );
    }

    if (scheduleIds.length > 0) {
        return (
            <Card className='p-2 mb-2'>
                <CardTitle className="mb-8">Flight Summary</CardTitle>
                <FormRow label="Outbound Trip" amount={priceOneWay} />
                {priceReturn > 0 && <FormRow label="Return Trip" amount={priceReturn} />}
                {guests > 1 && <FormRow label="Total Passengers" guest={guests} />}
                {guests > 1 && <FormRow label={`Total Price for ${guests} guests`} amount={subTotalAir} />}
                <FormRow label="VAT (Flight)" amount={taxAir} />
                <Separator className="mt-4" />
                <CardTitle className="mt-8">
                    <FormRow label="Booking Total" amount={orderTotalAir} />
                </CardTitle>
            </Card>
        );
    }
    
    return null;
}

function FormRow({ label, amount, guest }: { label: string; amount?: number; guest?:number }) {
    return (
        <p className="flex justify-between text-sm mb-2">
            <span>{label}</span>
            {amount && <span>{formatCurrency(amount)}</span>}
            {guest && <span>{guest} Person</span>}
        </p>
    );
}

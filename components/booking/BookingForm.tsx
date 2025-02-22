import { calculateTotals, calculateTotalsAirline, calculateTotalsTour } from "@/utils/calculateTotals";
import { formatCurrency } from "@/utils/format";
import { useAirline, useAirlineBooking, useBool, usePackage, useRoom } from "@/utils/store";
import { Card, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export default function BookingForm() {
    const { range, price, roomId } = useRoom((state) => state);
    const checkIn = range?.from as Date;
    const checkOut = range?.to as Date;
    const totals = roomId ? calculateTotals({ checkIn, checkOut, price }) : null;
    const { totalNights, subTotal, environment, tax, orderTotal } = totals || {};
    const {guests}=useAirline((state)=>state)
    
    const { scheduleIds, prices } = useAirlineBooking((state) => state);
    
    const priceOneWay = prices[0] || 0;
    const priceReturn = prices[1] || 0;
    const { subTotalAir, taxAir, orderTotalAir } = calculateTotalsAirline({ priceOneWay, priceReturn, guests });
    
    const {packageId,pricePackage,guestsPackage}=usePackage((state)=>state)
    const {subTotalPackage,taxPackage,orderTotalPackage}=calculateTotalsTour({pricePackage,guestsPackage})
    const {boolRoom,boolAir,boolTour}=useBool((state)=>state)
    if (price && boolRoom) {
        return (
            <Card className='p-5 mb-2'>
                <CardTitle className="mb-8">Room Booking Summary</CardTitle>
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

    if (packageId && boolTour) {
        return (
            <Card className='p-5 mb-2'>
                <CardTitle className="mb-8">Package Booking Summary</CardTitle>
                <FormRow label="Package Price" amount={pricePackage} />
                {guestsPackage > 1 && <FormRow label="Total Passengers" guest={guestsPackage} />}
                {guestsPackage > 1 && <FormRow label={`Total Price for ${guestsPackage} guests`} amount={subTotalPackage} />}
                <FormRow label="VAT" amount={taxPackage} />
                <Separator className="mt-4" />
                <CardTitle className="mt-8">
                    <FormRow label="Booking Total" amount={orderTotalPackage} />
                </CardTitle>
            </Card>
        );
    }

    if (scheduleIds.length > 0 && boolAir) {
        return (
            <Card className='p-5 mb-2'>
                <CardTitle className="mb-8">Flight Summary</CardTitle>
                <FormRow label="Outbound Trip" amount={priceOneWay} />
                {priceReturn > 0 && <FormRow label="Return Trip" amount={priceReturn} />}
                {guests > 1 && <FormRow label="Total Passengers" guest={guests} />}
                {guests > 1 && <FormRow label={`Total Price for ${guests} guests`} amount={subTotalAir} />}
                <FormRow label="VAT (10%)" amount={taxAir} />
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

import { calculateDaysBetween } from "./calendar";

type BookingDetails={
    checkIn:Date;
    checkOut:Date;
    price:number;
}

export const calculateTotals=({checkIn,checkOut,price}:BookingDetails)=>{
    const totalNights=calculateDaysBetween({checkIn,checkOut})
    const subTotal=totalNights*price
    const environment=subTotal*0.05
    const tax=subTotal*0.1
    const orderTotal=subTotal+environment+tax
    return{totalNights,subTotal,environment,tax,orderTotal}
}

export const calculateTotalsAirline = ({ priceOneWay, priceReturn, guests = 1 }: { priceOneWay: number; priceReturn?: number; guests?: number }) => {
    const subTotalAir = (priceOneWay + (priceReturn || 0)) * guests;
    const taxAir = subTotalAir * 0.1;
    const orderTotalAir = subTotalAir + taxAir;
    return { subTotalAir, taxAir, orderTotalAir };
};

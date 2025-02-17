import { SubmitButton } from "@/components/form/Button"
import FormContainer from "@/components/form/FormContainer"
import EmptyList from "@/components/home/EmptyList"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { deleteRoomAction, fetchRoomsRentals, fetchSchedulesRentals } from "@/utils/actions"
import { formatCurrency } from "@/utils/format"
import Link from "next/link"
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa"

export default async function RentalsPage() {
    const rentals=await fetchRoomsRentals()
    const airlines=await fetchSchedulesRentals()
  if(rentals.length === 0 && airlines.length===0){
    return(
        <EmptyList heading="No rentals to display"/>
    )
  }

  return(
    <>
        {rentals.length>0 && <><h4 className="mb-4 capitalize">active rooms: {rentals.length}</h4>
        <Table>
            <TableCaption>A List of all Your Rooms</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Nightly Rate</TableHead>
                    <TableHead>Nights Booked</TableHead>
                    <TableHead>Total Income</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rentals.map((rental)=>{
                    const {id:roomId,type,price,propertyId}=rental
                    const {totalNightsSum,orderTotalSum}=rental
                    return<TableRow>
                        <TableCell>{type}</TableCell>
                        <TableCell>{formatCurrency(price)}</TableCell>
                        <TableCell>{totalNightsSum || 0}</TableCell>
                        <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                        <TableCell className="flex items-center gap-x-2">
                            <Link href={`/rentals/${propertyId}/rooms/${roomId}/edit`}>
                                <FaRegEdit/>
                            </Link>
                            <DeleteRoom roomId={roomId}/>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table></>}
        {airlines.length>0 && <><h4 className="mb-4 capitalize">active schedules: {airlines.length}</h4>
        <Table>
            <TableCaption>A List of all Your Schedules</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Flight Codes</TableHead>
                    <TableHead>Price Per Trip</TableHead>
                    <TableHead>Total Passengers</TableHead>
                    <TableHead>Total Income</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {airlines.map((airline)=>{
                    const {id:scheduleId,flightCode,price}=airline
                    const {totalPassengersSum,orderTotalSum}=airline
                    return<TableRow>
                        <TableCell>{flightCode}</TableCell>
                        <TableCell>{formatCurrency(price)}</TableCell>
                        <TableCell>{totalPassengersSum || 0}</TableCell>
                        <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                        <TableCell className="flex items-center gap-x-2">
                            <Link href={`/rentals/${scheduleId}/edit`}>
                                <FaRegEdit/>
                            </Link>
                            <DeleteRoom roomId={scheduleId}/>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table></>} 
    </>
  )
}

function DeleteRoom({roomId}:{roomId:string}){
    const deleteRoom=deleteRoomAction.bind(null,{roomId})
    return <FormContainer action={deleteRoom}>
      <SubmitButton className='bg-transparent text-black border-none' icon={true}>
        <FaRegTrashAlt/>
      </SubmitButton>
    </FormContainer>
  }

import StatsContainer from "@/components/admin/StatsContainer";
import { SubmitButton } from "@/components/form/Button"
import FormContainer from "@/components/form/FormContainer"
import EmptyList from "@/components/home/EmptyList"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { deleteRoomAction, deleteScheduleAction, fetchRoomsRentals, fetchSchedulesRentals } from "@/utils/actions"
import { formatCurrency } from "@/utils/format"
import Link from "next/link"
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa"

export default async function RentalsPage() {
    const airlines=await fetchSchedulesRentals()
  if(airlines.length===0){
    return(
        <EmptyList heading="No rentals to display"/>
    )
  }

  return(
    <>
    <StatsContainer serviceType="airline"/>
        {airlines.length>0 && <><h4 className="mb-4 capitalize font-bold">active schedules: {airlines.length}</h4>
        <Table>
            <TableCaption>A List of all Your Schedules</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Airline Name</TableHead>
                    <TableHead>Flight Codes</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Price Per Trip</TableHead>
                    <TableHead>Total Passengers</TableHead>
                    <TableHead>Total Income</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {airlines.map((airline)=>{
                    const {id:scheduleId,flightCode,price,airlineId, origin,destination}=airline
                    const {totalPassengersSum,orderTotalSum}=airline
                    const {name}=airline.airline
                    return<TableRow>
                        <TableCell>{name}</TableCell>
                        <TableCell>{flightCode}</TableCell>
                        <TableCell>{origin}</TableCell>
                        <TableCell>{destination}</TableCell>
                        <TableCell>{formatCurrency(price)}</TableCell>
                        <TableCell>{totalPassengersSum || 0}</TableCell>
                        <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                        <TableCell className="flex items-center gap-x-2">
                            <Link href={`/myairlines/${airlineId}/schedules/${scheduleId}/edit`}>
                                <FaRegEdit/>
                            </Link>
                            <DeleteSchedule scheduleId={scheduleId}/>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table></>} 
    </>
  )
}

  function DeleteSchedule({scheduleId}:{scheduleId:string}) {
    const deleteSchedule=deleteScheduleAction.bind(null,{scheduleId})
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline"><FaRegTrashAlt/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              The schedule and its related data will be deleted. Would you like to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <FormContainer action={deleteSchedule}>
                <AlertDialogAction type='submit' className="">Yes</AlertDialogAction>
            </FormContainer>
            <AlertDialogCancel>No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

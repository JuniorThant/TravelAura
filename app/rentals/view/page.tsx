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
import { Button } from "@/components/ui/button"
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
  if(rentals.length === 0){
    return(
        <EmptyList heading="No rentals to display"/>
    )
  }

  return(
    <>
    <StatsContainer serviceType="property"/>
        {rentals.length>0 && <><h4 className="mb-4 capitalize font-bold">active rooms: {rentals.length}</h4>
        <Table>
            <TableCaption>A List of all Your Rooms</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Property Name</TableHead>
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
                    const {name:propertyName}=rental.property
                    return<TableRow>
                        <TableCell>{propertyName}</TableCell>
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
    </>
  )
}

  function DeleteRoom({roomId}:{roomId:string}) {
    const deleteRoom=deleteRoomAction.bind(null,{roomId})
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              The package and its related data will be deleted. Would you like to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <FormContainer action={deleteRoom}>
                <AlertDialogAction type='submit' className="">Yes</AlertDialogAction>
            </FormContainer>
            <AlertDialogCancel>No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

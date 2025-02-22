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
import { deletePackageAction, deleteRoomAction, deleteScheduleAction, fetchPackageDetails, fetchPackageRentals, fetchRoomsRentals, fetchSchedulesRentals } from "@/utils/actions"
import { formatCurrency } from "@/utils/format"
import Link from "next/link"
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa"

export default async function RentalsPage() {
    const tours=await fetchPackageRentals()
  if(tours.length===0){
    return(
        <EmptyList heading="No rentals to display"/>
    )
  }

  return(
    <>
    <StatsContainer serviceType="tour"/>
        {tours.length>0 && <><h4 className="mb-4 capitalize font-bold">active packages: {tours.length}</h4>
        <Table>
            <TableCaption>A List of all Your Packages</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Tour Name</TableHead>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Price Per Trip</TableHead>
                    <TableHead>Total Passengers</TableHead>
                    <TableHead>Total Income</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tours.map((tour)=>{
                    const {id:packageId,name,price,tourId}=tour
                    const {totalGuestsSum,orderTotalSum}=tour
                    const{name:tourName}=tour.tour
                    return<TableRow>
                        <TableCell>{tourName}</TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>{formatCurrency(price)}</TableCell>
                        <TableCell>{totalGuestsSum || 0}</TableCell>
                        <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                        <TableCell className="flex items-center gap-x-2">
                            <Link href={`/mytours/${tourId}/packages/${packageId}/edit`}>
                                <FaRegEdit/>
                            </Link>
                            <DeleteTour packageId={packageId}/>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table></>} 
    </>
  )
}


  function DeleteTour({packageId}:{packageId:string}) {
    const deletePackage=deletePackageAction.bind(null,{packageId})
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline"><FaRegTrashAlt/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              The package and its related data will be deleted. Would you like to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <FormContainer action={deletePackage}>
                <AlertDialogAction type='submit' className="">Yes</AlertDialogAction>
            </FormContainer>
            <AlertDialogCancel>No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

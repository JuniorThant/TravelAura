import { deleteRoomBookingAction } from "@/utils/actions";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

export function DeleteBooking({ bookingId }: { bookingId: string }) {
    // State to manage modal visibility
    const [showModal, setShowModal] = useState(false);
  
    // This is the function to delete the booking, which will be passed to the form container
    const deleteBooking = deleteRoomBookingAction.bind(null, { bookingId });
  
    // Handle the cancellation confirmation
    const handleCancelClick = () => {
      setShowModal(true); // Show the modal when the user clicks the cancel button
    };
  
    // Handle the user's choice in the modal
    const handleConfirmDelete = () => {
      deleteBooking(); // Call the delete function
      setShowModal(false); // Close the modal after confirming
    };
  
    const handleCloseModal = () => {
      setShowModal(false); // Close the modal if the user cancels
    };
  
    return (
      <>
            <AlertDialog>
            <AlertDialogTrigger>Cancel Booking</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>This booking is non-refundable. Are you sure that you want to cancel this booking?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Yes</AlertDialogAction>
                <AlertDialogCancel>No</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </>
    );
  }
  
'use client';
import { useState, useEffect } from 'react';
import { fetchPendings } from "@/utils/actions";
import Image from "next/image";
import { Document, Page, pdfjs } from 'react-pdf';
import Title from '../properties/Title';
import Amenities from '../properties/Amenities';
import { PendingProps } from '@/utils/types';
import PdfPreview from './PDFPreview';
import { Button } from '../ui/button';
import { updatePending } from "@/utils/actions"; // Import the updatePending function

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ItemLicense() {
  const [pendings, setPendings] = useState<PendingProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPendings();
        // Combine all pending items into a single array
        const combinedPendings = [
          ...data.properties,
          ...data.airlines,
          ...data.tours,
        ];
        setPendings(combinedPendings);
      } catch (error) {
        console.error("Error fetching pending items:", error);
      }
    };

    fetchData();
  }, []);

  // Handle approve button click
  const handleApprove = async (id: string, type: "property" | "airline" | "tour") => {
    try {
      await updatePending(id, type);  // Removed email
      // Optionally update local state to reflect the approved status
      setPendings(prevPendings => prevPendings.filter(pending => pending.id !== id));
    } catch (error) {
      console.error("Error updating pending item:", error);
    }
  };

  return (
    <>
      <Title text="Pending Items" />
      <div className="space-y-5">
        {pendings.map((pending) => (
          <div
            key={pending.id}
            className="border border-black flex p-4"
            style={{ position: "relative" }}
          >
            <div className="w-60 h-24 flex items-center justify-center overflow-hidden">
              {pending.image ? (
                <Image
                  src={pending.image}
                  alt="pending image"
                  width={150}
                  height={150}
                  objectFit="cover"
                  className=""
                />
              ) : (
                <span>No Image</span>
              )}
            </div>

            <div className="ml-4 flex flex-col justify-between w-full">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* Left Column */}
                <div className="col-span-1">
                  {pending.name && (
                    <>
                      <Title text="Name" />
                      <p>{pending.name}</p>
                    </>
                  )}
                  {pending.category && (
                    <>
                      <Title text="Category" />
                      <p>{pending.category}</p>
                    </>
                  )}
                  {pending.tagline && (
                    <>
                      <Title text="Tagline" />
                      <p>{pending.tagline}</p>
                    </>
                  )}
                  {pending.description && (
                    <>
                      <Title text="Description" />
                      <p>{pending.description}</p>
                    </>
                  )}
                  {pending.address && (
                    <>
                      <Title text="Address" />
                      <p>{pending.address}</p>
                    </>
                  )}
                </div>

                {/* Right Column */}
                <div className="col-span-1">
                  {pending.amenities && (
                    <>
                      <Title text="Amenities" />
                      <Amenities
                        amenities={pending.amenities ?? "[]"}
                        text="The amenities are: "
                      />
                    </>
                  )}
                  
                  {/* PDF Preview and Download */}
                  {pending.file && pending.file.endsWith(".pdf") && (
                    <div className="mt-4">
                      <Title text="Company Documents Preview" />
                      <a
                        href={pending.file}
                        download
                        className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                      >
                        View PDF
                      </a>
                    </div>
                  )}
                  
                  {/* Approve Button */}
                  <Button
  className="mt-5"
  onClick={() => {
    if (pending.type) {  // Ensure the type is defined
      handleApprove(pending.id, pending.type);  // Call the function only if type is defined
    }
  }}
>
  Approve Registration
</Button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

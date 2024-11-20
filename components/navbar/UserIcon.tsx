import { LucideUser2 } from "lucide-react"
import { fetchProfileImage } from "@/utils/actions"


export default async function UserIcon() {
  const profileImage=await fetchProfileImage()
  if(profileImage){
    return <img src={profileImage} className="w-7 h-7 rounded-full object-cover"/>
  }
  return (
    <LucideUser2 className="w-7 h-7 bg-primary rounded-full text-white"/>
  )
}

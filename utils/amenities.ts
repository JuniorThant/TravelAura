
import { IconType } from 'react-icons';
import { FaSwimmingPool, FaShuttleVan, FaBed, FaWifi, FaBath, FaUtensils, FaTv, FaPlane, FaCar, FaDog, FaUmbrellaBeach, FaBicycle } from 'react-icons/fa'; // Example icons
import { FaVolleyball } from 'react-icons/fa6';
import { GiMicrophone, GiPoolTriangle, GiProtectionGlasses, GiWeightLiftingUp } from 'react-icons/gi';
import {  LuWine } from 'react-icons/lu';
import { MdAirlineSeatLegroomExtra, MdAirlineSeatReclineExtra, MdCleaningServices, MdCurrencyExchange, MdKayaking, MdLiveTv, MdOutlet, MdOutlineChildFriendly, MdOutlineLocalLaundryService, MdOutlineSecurity, MdParagliding } from 'react-icons/md';
import { TbFridge, TbMassage } from 'react-icons/tb';
import { PiHairDryerBold } from "react-icons/pi";


export type Amenity = {
  name: string;
  icon: IconType;
  selected: boolean;
};

export const propertyAmenities: Amenity[] = [
  { name: 'Swimming Pool', icon: FaSwimmingPool, selected: false },
  { name: 'Airport Shuttle Service', icon: FaShuttleVan, selected: false },
  { name: 'Fitness Room', icon: GiWeightLiftingUp, selected: false },
  { name: 'Free Wi-Fi', icon: FaWifi, selected: false },
  { name: 'Free Parking', icon: FaCar, selected: false },
  { name: 'Pet Friendly', icon: FaDog, selected: false },
  { name: '24/7 Security', icon: MdOutlineSecurity, selected: false },
  { name: 'Kayaking', icon: MdKayaking, selected: false },
  { name: 'Laundry Service', icon: MdOutlineLocalLaundryService, selected: false },
  { name: 'Restaurant on-site', icon: FaUtensils, selected: false },
  { name: 'Paragliding', icon: MdParagliding, selected: false },
  { name: 'Childcare Services', icon: MdOutlineChildFriendly, selected: false },
  { name: 'Spa Services', icon: TbMassage, selected: false },
  { name: 'Bar/Lounge', icon: LuWine, selected: false },
  { name: 'Beachfront', icon: FaUmbrellaBeach, selected: false },
  { name: 'Karaoke', icon: GiMicrophone, selected: false },
  { name: 'Snorkelling', icon: GiProtectionGlasses, selected: false },
  { name: 'Billiards Room', icon: GiPoolTriangle, selected: false },
  { name: 'Bicycle Rentals', icon: FaBicycle, selected: false },
  { name: 'Currency Exchange', icon: MdCurrencyExchange, selected: false },
  { name: 'Beach Volleyball', icon: FaVolleyball, selected: false },
];

export const roomAmenities: Amenity[] = [
  { name: 'Free Breakfast', icon: FaUtensils, selected: false },
  { name: 'Bathtub Included', icon: FaBath, selected: false },
  { name: 'Free Wi-Fi', icon: FaWifi, selected: false },
  { name: 'Smart TV', icon: FaTv, selected: false },
  { name: 'Room Cleaning Service', icon: MdCleaningServices, selected: false },
  { name: 'Hairdryer', icon: PiHairDryerBold, selected: false },
  { name: 'Fridge', icon: TbFridge, selected: false },
];

export const scheduleAmenities: Amenity[] = [
  { name: 'Meal Provided', icon: FaUtensils, selected: false },
  { name: 'Extra Leg Room', icon: MdAirlineSeatLegroomExtra, selected: false },
  { name: 'In-flight Entertainment', icon: MdLiveTv, selected: false },
  { name: 'In-flight Wi-Fi', icon: FaWifi, selected: false },
  { name: 'Power Outlets', icon: MdOutlet, selected: false },
  { name: 'Reclinable Seat', icon: MdAirlineSeatReclineExtra, selected: false },
  { name: 'Snacks Available', icon: FaUtensils, selected: false },
];

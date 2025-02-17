import { IconType } from 'react-icons';
import { MdCabin } from 'react-icons/md';

import {  TbTent } from 'react-icons/tb';
import { FaHotel } from "react-icons/fa6";
import { MdHotel } from "react-icons/md";
import { MdApartment } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { FaUmbrellaBeach } from "react-icons/fa6";

type Category = {
  label: CategoryLabel;
  icon: IconType;
};

export type CategoryLabel =
  | 'cabin'
  | 'tent'
  | 'hotel'
  | 'guesthouse'
  | 'condo'
  | 'airbnb'
  | 'resort';

export const categories: Category[] = [
  {
    label: 'cabin',
    icon: MdCabin,
  },
  {
    label: 'tent',
    icon: TbTent,
  },
  {
    label: 'hotel',
    icon: FaHotel,
  },
  {
    label: 'guesthouse',
    icon: MdHotel,
  },
  {
    label: 'condo',
    icon: MdApartment,
  },
  {
    label: 'airbnb',
    icon: FaHouse,
  },
  {
    label: 'resort',
    icon: FaUmbrellaBeach,
  },
];
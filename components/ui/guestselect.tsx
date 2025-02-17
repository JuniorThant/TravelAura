import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface GuestSelectProps {
  onValueChange: (value: number) => void;
}

export default function GuestSelect({ onValueChange }: GuestSelectProps) {
  return (
    <Select onValueChange={(value) => onValueChange(Number(value))}>
      <SelectTrigger className="w-[220px] text-sm">
        <SelectValue placeholder="Select the number of guests" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
        <SelectItem value="3">3</SelectItem>
        <SelectItem value="4">4</SelectItem>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="6">6</SelectItem>
        <SelectItem value="7">7</SelectItem>
        <SelectItem value="8">8</SelectItem>
      </SelectContent>
    </Select>
  );
}

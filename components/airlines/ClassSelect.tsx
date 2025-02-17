import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface ClassSelect {
  onValueChange: (value: string) => void;
}

export default function ClassSelect({ onValueChange }: ClassSelect) {
  return (
    <Select onValueChange={(value) => onValueChange(String(value))}>
      <SelectTrigger className="w-[220px] text-sm">
        <SelectValue placeholder="Select the class" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="economy">economy</SelectItem>
        <SelectItem value="business">business</SelectItem>
        <SelectItem value="firstClass">firstClass</SelectItem>
      </SelectContent>
    </Select>
  );
}

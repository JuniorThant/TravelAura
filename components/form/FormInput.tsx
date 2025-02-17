import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultValue?:string | number;
};

export default function FormInput(props: FormInputProps) {
  const { name, type, label, value, onChange, placeholder,defaultValue  } = props;
  
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">{label || name}</Label>
      <Input 
        id={name} 
        name={name} 
        type={type} 
        value={value} // ✅ Controlled component
        onChange={onChange} // ✅ Handles state updates
        placeholder={placeholder} 
        defaultValue={defaultValue}
        required 
      />
    </div>
  );
}

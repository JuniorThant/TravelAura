import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { Label } from '@radix-ui/react-dropdown-menu';
import DateTimePicker from 'react-datetime-picker';

type DateValue = Date | null;

export function DateTimePickerDemo({ label, value, onChange }: { label: string; value: DateValue; onChange: (value: DateValue) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <DateTimePicker onChange={onChange} value={value} />
    </div>
  );
}

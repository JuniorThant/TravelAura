"use client"
import { useState, useEffect } from 'react';
import { Amenity, propertyAmenities, roomAmenities, scheduleAmenities } from '@/utils/amenities';
import { Checkbox } from '@/components/ui/checkbox';

function AmenitiesInput({ type, defaultValue }: { type: 'property' | 'room' | 'schedule'; defaultValue?: Amenity[] }) {
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);

  // Sync state with defaultValue when it changes
  useEffect(() => {
    setSelectedAmenities(defaultValue || (type === 'property' ? propertyAmenities : type === 'room' ? roomAmenities : scheduleAmenities));
  }, [defaultValue, type]);

  const handleChange = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.map((a) =>
        a.name === amenity.name ? { ...a, selected: !a.selected } : a
      )
    );
  };

  return (
    <section>
      <input type="hidden" name="amenities" value={JSON.stringify(selectedAmenities)} />
      <div className="grid grid-cols-2 gap-4">
        {selectedAmenities.map((amenity) => (
          <div key={amenity.name} className="flex items-center space-x-2">
            <Checkbox
              id={amenity.name}
              checked={amenity.selected}
              onCheckedChange={() => handleChange(amenity)}
            />
            <label htmlFor={amenity.name} className="text-sm font-medium leading-none capitalize flex gap-x-2 items-center">
              {amenity.name}
              {amenity.icon && <amenity.icon className="w-4 h-4" />}
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AmenitiesInput;

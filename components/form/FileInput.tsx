import { Label } from '../ui/label';
import { Input } from '../ui/input';
import React from 'react';

export default function FileInput({ name,label }: { name: string,label?:string }) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>{!label?name:label}</Label>
      <Input id={name} name={name} type='file' required accept='application/pdf' className='max-w-xs' />
    </div>
  );
}

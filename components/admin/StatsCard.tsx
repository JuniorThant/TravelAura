import { Card, CardHeader } from "../ui/card";

type StatsCardProps={
  title:string;
  value:number;
  dollar?:boolean;
}

export default function StatsCard({title,value,dollar}:StatsCardProps) {
  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row justify-between items-center">
        <h4 className="capitalize text-3xl font-bold">{title}</h4>
        <span className="text-primary text-2xl font-extrabold">{dollar?"$":''}{value}</span>
      </CardHeader>
    </Card>
  )
}

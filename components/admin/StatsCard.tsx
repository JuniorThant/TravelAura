import { Card, CardHeader } from "../ui/card";

type StatsCardProps={
  title:string;
  value:number;
}

export default function StatsCard({title,value}:StatsCardProps) {
  return (
    <Card className="bg-muted">
      <CardHeader className="flex flex-row justify-between items-center">
        <h4 className="capitalize text-3xl font-bold">{title}</h4>
        <span className="text-primary text-2xl font-extrabold">{value}</span>
      </CardHeader>
    </Card>
  )
}

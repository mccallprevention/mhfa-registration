import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/lib/types";
import { formatDate, formatTimeRange, generatePrefillUrl } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const prefillUrl = generatePrefillUrl(event);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex-1">{event.title}</CardTitle>
          <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
            event.trainingType === "MHFA" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {event.trainingType}
          </span>
        </div>
        <CardDescription>
          {formatDate(event.date)} • {formatTimeRange(event.startTime, event.endTime)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Location</p>
          <p className="text-sm text-gray-600">{event.location}</p>
        </div>
        {event.address && (
          <div>
            <p className="text-sm font-medium text-gray-700">Address</p>
            <p className="text-sm text-gray-600 select-all">{event.address}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={prefillUrl} target="_blank" rel="noopener noreferrer">
            Register for Event
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
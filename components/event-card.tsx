import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime, generatePrefillUrl } from "@/lib/utils";
import { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const prefillUrl = generatePrefillUrl(event);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {formatDate(event.date)} at {formatTime(event.time)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Location:</span> {event.location}
        </p>
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
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/lib/types";
import { formatDate, formatTimeRange, generatePrefillUrl } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const prefillUrl = generatePrefillUrl(event);
  
  return (
    <Card className="w-full lg:h-full lg:flex lg:flex-col border-0 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Top accent bar - always blue */}
      <div className="h-2 bg-mccall-gradient-blue" />
      
      <CardHeader className="pb-3 lg:flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl text-mccall-navy mb-3 h-[3rem] flex items-start">{event.title}</CardTitle>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-gray-600 text-sm">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>{formatDate(event.date)}</div>
                  <div>{formatTimeRange(event.startTime, event.endTime)}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{event.location}</p>
                  {event.address && (
                    <p className="text-sm text-gray-600 select-all">{event.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${
            event.trainingType === "MHFA" 
              ? "bg-[#003057] text-white" 
              : "bg-[#80bc00] text-white"
          }`}>
            {event.trainingType}
          </span>
        </div>
      </CardHeader>
      
      <CardFooter className="pt-6">
        <Button 
          asChild 
          className="w-full bg-[#80bc00] hover:bg-[#6ca000] text-white font-semibold py-6 text-base rounded-full transition-colors"
        >
          <a href={prefillUrl} target="_blank" rel="noopener noreferrer">
            Register
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
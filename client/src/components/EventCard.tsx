import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { Event } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
  language: "en" | "fr";
}

export function EventCard({ event, language }: EventCardProps) {
  const { t } = useTranslation();
  const title = language === "en" ? event.titleEn : event.titleFr;
  const location = language === "en" ? event.locationEn : event.locationFr;
  const available = event.capacity - (event.registeredCount ?? 0);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={event.imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.date), "PPP")}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{location}</p>
        <p className="text-sm mt-2">
          {available > 0
            ? t("event.capacity", { available })
            : t("event.full")}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/events/${event.id}`}>
          <Button className="w-full">
            {available > 0 ? t("common.register") : t("common.waitlist")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
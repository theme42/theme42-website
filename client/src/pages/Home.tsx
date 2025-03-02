import { Hero } from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { i18n } = useTranslation();
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const upcomingEvents = events?.filter(e => e.status === "upcoming") || [];

  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))
          ) : (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                language={i18n.language as "en" | "fr"}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

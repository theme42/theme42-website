import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { EventCard } from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Events() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filteredEvents = events?.filter(e => e.status === filter) || [];

  return (
    <div className="container py-24">
      <h1 className="text-4xl font-bold mb-8">{t("common.events")}</h1>

      <Tabs
        defaultValue="upcoming"
        onValueChange={(v) => setFilter(v as "upcoming" | "past")}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="upcoming">{t("common.upcoming")}</TabsTrigger>
          <TabsTrigger value="past">{t("common.past")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              language={i18n.language as "en" | "fr"}
            />
          ))
        )}
      </div>
    </div>
  );
}

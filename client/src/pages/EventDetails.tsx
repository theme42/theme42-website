import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Event, Registration } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuthContext } from "@/components/AuthProvider";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!user || !event) return;
      const res = await apiRequest("POST", "/api/registrations", {
        eventId: event.id,
        userId: user.id,
      });
      return res.json() as Promise<Registration>;
    },
    onSuccess: (data) => {
      if (!data) return;
      toast({
        title: data.status === "confirmed" 
          ? t("event.registered")
          : t("event.waitlisted"),
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-24 space-y-8">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const title = i18n.language === "en" ? event.titleEn : event.titleFr;
  const description = i18n.language === "en" ? event.descriptionEn : event.descriptionFr;
  const location = i18n.language === "en" ? event.locationEn : event.locationFr;
  const registeredCount = event.registeredCount ?? 0;

  return (
    <div className="container py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>

        <div className="aspect-video mb-8 rounded-lg overflow-hidden">
          <img
            src={event.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-semibold mb-2">{t("event.date")}</h2>
            <p>{format(new Date(event.date), "PPP")}</p>
          </div>
          <div>
            <h2 className="font-semibold mb-2">{t("event.location")}</h2>
            <p>{location}</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p>{description}</p>
        </div>

        {user && (
          <Button
            size="lg"
            onClick={() => registerMutation.mutate()}
            disabled={registerMutation.isPending}
          >
            {registeredCount >= event.capacity
              ? t("common.waitlist")
              : t("common.register")}
          </Button>
        )}
      </div>
    </div>
  );
}
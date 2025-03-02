import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { translations } from "@shared/i18n";

i18n.init({
  resources: translations,
  lng: "en",
  fallbackLng: "en",
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="pt-14">
              <Router />
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
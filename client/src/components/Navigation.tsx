import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const { t } = useTranslation();
  const { user, signIn, signOut } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/">
          <a className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Theme42</span>
          </a>
        </Link>

        <div className="flex items-center justify-between flex-1">
          <div className="flex gap-6">
            <Link href="/events">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.events")}
              </a>
            </Link>
            <Link href="/about">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.about")}
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            {user ? (
              <Button variant="outline" onClick={signOut}>
                {t("common.logout")}
              </Button>
            ) : (
              <Button onClick={signIn}>
                {t("common.login")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

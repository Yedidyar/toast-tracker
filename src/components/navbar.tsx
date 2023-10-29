import React from "react";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import Link from "next/link";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useReadLocalStorage } from "usehooks-ts";
import {
  TermsAndConditionsModal,
  termsAndConditionsLocalStorageKey,
} from "~/modals/terms-and-conditions";
import { show } from "@ebay/nice-modal-react";

const Navbar = () => {
  const { data: sessionData } = useSession();
  const showTermsAndConditions = useReadLocalStorage<boolean | null>(
    termsAndConditionsLocalStorageKey
  );

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center gap-2 space-x-4">
          {sessionData ? (
            <UserNav {...sessionData} />
          ) : (
            <Button
              onClick={async () => {
                if (showTermsAndConditions !== false) {
                  await show(TermsAndConditionsModal).then(() => {
                    void signIn();
                  });

                  return;
                }
                void signIn();
              }}
            >
              התחבר
            </Button>
          )}
          <ModeToggle />
        </div>
        <MainNav />
        <Link href="https://github.com/Yedidyar/toast-tracker">
          <GitHubLogoIcon />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex items-center gap-2 space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ראשי
      </Link>
      <Link
        href="/toasts-history"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        גרף היסטורי
      </Link>
    </nav>
  );
}

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

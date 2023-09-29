import React from "react";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import { cn } from "~/lib/utils";

const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          {sessionData ? (
            <UserNav {...sessionData} />
          ) : (
            <Button onClick={() => signIn()}>התחבר</Button>
          )}
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

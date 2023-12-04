import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import format from "date-fns/format";
import { he } from "date-fns/locale";
import type { Occasion } from "@prisma/client";
import NiceModal from "@ebay/nice-modal-react";
import { EditToastModal } from "~/modals/toasts";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import type { toast } from "drizzle/schema";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type OutputExample = RouterOutput["someRoute"]["someQuery"];


type Props = {
  occasion: Pick<Occasion, "name">;
  user: {
    name: string | null;
  };
  className?: string;
} & typeof toast;

const className = "h-44 w-44 p-5 lg:h-52 lg:w-52 bg-primary-foreground lg:p-10";

export function ToastCard(props: Props) {
  const { data: sessionData } = useSession();

  console.log(props);

  return null;
  const { dateToBeDone, occasion, user } = props;
  return (
    <Card
      className={cn(
        "transform transition duration-500 hover:scale-110",
        props.className,
        sessionData && "cursor-pointer",
        className
      )}
      onClick={() => {
        if (sessionData) {
          return NiceModal.show(EditToastModal, { toast: props });
        }
      }}
    >
      <CardHeader>
        <CardTitle>
          {user.name} - {occasion.name}
        </CardTitle>
        <CardDescription>
          {format(dateToBeDone, "dd.MM.yyyy HH:mm", { locale: he })}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ToastCardSkelton() {
  return <Skeleton className={className} />;
}

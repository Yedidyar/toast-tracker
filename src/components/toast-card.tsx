import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import format from "date-fns/format";
import { he } from "date-fns/locale";
import type { Toast, Occasion } from "~/drizzle/schema";

import NiceModal from "@ebay/nice-modal-react";
import { EditToastModal } from "~/modals/toasts";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";

type Props = {
  Occasion: Pick<Occasion, "name"> | null;
  User: {
    name: string | null;
  } | null;
  className?: string;
  Toast: Toast;
};

const className = "h-44 w-44 p-5 lg:h-52 lg:w-52 bg-primary-foreground lg:p-10";

export function ToastCard(props: Props) {
  const { data: sessionData } = useSession();
  if (!props.Occasion || !props.User) {
    return null;
  }

  const {
    Occasion,
    Toast: { dateToBeDone },
    User,
  } = props;
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
          return NiceModal.show(EditToastModal, { toast: props.Toast });
        }
      }}
    >
      <CardHeader>
        <CardTitle>
          {User.name} - {Occasion.name}
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

import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import format from "date-fns/format";
import { he } from "date-fns/locale";
import type { Occasion, Toast } from "@prisma/client";
import NiceModal from "@ebay/nice-modal-react";
import { EditToastModal } from "~/modals/toasts";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";

type Props = {
  occasion: Pick<Occasion, "name">;
  user: {
    name: string | null;
  };
  className?: string;
} & Toast;

export function ToastCard(props: Props) {
  const { data: sessionData } = useSession();

  const { dateToBeDone, occasion, user } = props;
  return (
    <Card
      className={cn(
        "h-52 w-52 transform  bg-primary-foreground p-10 transition duration-500 hover:scale-110",
        props.className,
        sessionData && "cursor-pointer"
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

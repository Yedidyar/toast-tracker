import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import format from "date-fns/format";
import { he } from "date-fns/locale";

type Props = {
  occasion: {
    name: string;
  };
} & {
  id: string;
  userId: string;
  occasionId: string;
  dateToBeDone: Date;
  wasDone: boolean;
  createdAt: Date;
  updatedAt: Date;
} & {
  user: {
    name: string | null;
  };
};

export function ToastCard({ dateToBeDone, occasion, user }: Props) {
  return (
    <Card className="w-[350px] p-10">
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

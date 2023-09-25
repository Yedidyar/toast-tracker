import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import type { CriminalType } from "@prisma/client";
import { Avatar, AvatarFallback } from "./ui/avatar";

const criminalsTypes = {
  PERSONA_NON_GRATA: "פרסונה נון גרטה",
  REGULAR: "עבריין",
} as const satisfies Record<CriminalType, string>;

export const Criminals = () => {
  const [open, setOpen] = useState(false);
  const { data } = api.criminal.getAll.useQuery(undefined, { enabled: open });

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="secondary">הצג עבריינים</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-8">
          {data?.map(({ user: { name }, type }) => {
            return (
              <>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="mr-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {criminalsTypes[type]}
                    </p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

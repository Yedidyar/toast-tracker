import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import type { CriminalType } from "@prisma/client";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Skeleton } from "./ui/skeleton";

const criminalsTypes = {
  PERSONA_NON_GRATA: "פרסונה נון גרטה",
  REGULAR: "עבריין",
} as const satisfies Record<CriminalType, string>;

export const Criminals = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = api.criminal.getAll.useQuery(undefined, {
    enabled: isOpen,
  });
  const [parent] = useAutoAnimate();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="secondary">הצג עבריינים</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-8" ref={parent}>
          {isLoading &&
            Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-9 w-9" />
            ))}
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

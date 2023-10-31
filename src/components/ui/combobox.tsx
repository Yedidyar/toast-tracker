import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";
import { cn } from "~/lib/utils";
import { FormControl } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { Button } from "./button";
type Item = { label: string; id: string };
type Props = {
  items?: Item[];
  selectedItem?: Item | null;
  onChange: (value: string) => void;
};

export const Combobox = ({ items, selectedItem, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !selectedItem && "text-muted-foreground"
            )}
          >
            {selectedItem?.id
              ? items?.find((item) => item.label === selectedItem.label)?.label
              : "בחר"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="בחר..." className="h-9" />
          <CommandEmpty>לא נמצאו אפשרויות</CommandEmpty>
          <CommandGroup>
            {items?.map((item) => (
              <CommandItem
                value={item.label}
                key={item.id}
                onSelect={(value) => {
                  onChange(value === selectedItem?.label ? "" : item.id);
                  setIsOpen(false);
                }}
              >
                {item.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    item.id === selectedItem?.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

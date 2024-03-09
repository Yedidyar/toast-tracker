import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { api } from "../utils/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";

import { type ReactNode } from "react";
import type { Toast } from "~/drizzle/schema";
import { Combobox } from "~/components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import format from "date-fns/format";
import { Calendar } from "~/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { he } from "date-fns/locale";
import { Loading } from "~/components/ui/loading";
import { Input } from "~/components/ui/input";
import type { SelectSingleEventHandler } from "react-day-picker";
import { useSession } from "next-auth/react";
import { useConfetti } from "~/hooks/use-confetti";

const ToastFormSchema = z.object({
  dateToBeDone: z.date(),
  occasionId: z.string().min(1),
  userId: z.string().min(1),
  wasDone: z.boolean().optional(),
});

const invalidateToast = async (
  utils: ReturnType<typeof api.useContext>,
  invaladate: () => unknown
) => {
  await invaladate();
  utils.toast.invalidate().catch((e) => {
    console.error(e);
  });
};

const loadingContainerClassName =
  "absolute left-[50%] top-[50%] z-50 h-full w-full translate-x-[-50%] translate-y-[-50%]";

export const AddToastModal = NiceModal.create(() => {
  const confetti = useConfetti();
  const modal = useModal();

  const utils = api.useContext();
  const { mutateAsync: invalidate } =
    api.toast.invalidateLeaderBoard.useMutation();

  const { mutateAsync, isLoading } = api.toast.create.useMutation({
    onSuccess: () => invalidateToast(utils, invalidate),
  });

  const onSubmit = async (values: z.infer<typeof ToastFormSchema>) => {
    await mutateAsync(values);
    void confetti?.addConfetti();
    closeModal();
  };

  const closeModal = () => void modal.hide();

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>הוספת שתיה</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="relative">
          {isLoading && (
            <div className={loadingContainerClassName}>
              <Loading />
            </div>
          )}
          <div className={cn(isLoading && "opacity-50")}>
            <ToastForm
              onSubmit={onSubmit}
              footer={
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    יצירה
                  </Button>
                </DialogFooter>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export const EditToastModal = NiceModal.create(
  ({ toast }: { toast: Toast }) => {
    const modal = useModal();
    const confetti = useConfetti();

    const utils = api.useContext();
    const { data: sessionData } = useSession();

    const { mutateAsync: invalidate } =
      api.toast.invalidateLeaderBoard.useMutation();

    const { mutateAsync, isLoading } = api.toast.update.useMutation({
      onSuccess: () => invalidateToast(utils, invalidate),
    });

    const { mutateAsync: mutateDeleteAsync, isLoading: isLoadingDelete } =
      api.toast.delete.useMutation({
        onSuccess: () => invalidateToast(utils, invalidate),
      });

    const onDelete = async () => {
      await mutateDeleteAsync({ id: toast.id });
      closeModal();
    };
    const onSubmit = async (values: z.infer<typeof ToastFormSchema>) => {
      await mutateAsync({ ...values, id: toast.id });
      closeModal();
      if (values.wasDone && !toast.wasDone) {
        void confetti?.addConfetti();
      }
    };

    const closeModal = () => void modal.hide();

    return (
      <Dialog
        open={modal.visible}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>עריכת שתיה</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="relative">
            {(isLoading || isLoadingDelete) && (
              <div className={loadingContainerClassName}>
                <Loading />
              </div>
            )}
            <div className={cn(isLoading && "opacity-50")}>
              <ToastForm
                onSubmit={onSubmit}
                defaultValues={toast}
                footer={
                  <DialogFooter className="flex gap-4">
                    {(sessionData?.user.role === "ADMIN" ||
                      sessionData?.user.id === toast.userId) && (
                      <>
                        <Button
                          variant="destructive"
                          disabled={isLoading}
                          onClick={onDelete}
                        >
                          מחיקה
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          עריכה
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

const ToastForm = ({
  onSubmit,
  defaultValues,
  footer,
}: {
  onSubmit: (values: z.infer<typeof ToastFormSchema>) => Promise<void>;
  defaultValues?: Toast;
  footer: ReactNode;
}) => {
  const { data: sessionData } = useSession();
  const form = useForm({
    resolver: zodResolver(ToastFormSchema),
    defaultValues: defaultValues ?? {
      wasDone: false,
      dateToBeDone: new Date(),
    },
  });

  const { data: occasions } = api.occasion.getAll.useQuery();
  const { data: users } = api.user.getAll.useQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="occasionId"
          render={({ field }) => {
            const getSelectedOccasion = () => {
              const occasion = occasions?.find(
                (occasion) => occasion.id === field.value
              );

              if (!occasion) return;

              return {
                label: occasion.name,
                id: occasion.id,
              };
            };

            return (
              <FormItem className="flex flex-col">
                <FormLabel>אירוע</FormLabel>
                <Combobox
                  items={occasions?.map(({ name, id }) => ({
                    label: name,
                    id,
                  }))}
                  selectedItem={getSelectedOccasion()}
                  onChange={(value) => {
                    form.setValue("occasionId", value);
                  }}
                />
                <FormDescription>לשם מה אנחנו מתכנסים?</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => {
            const getSelectedUser = () => {
              const user = users?.find((user) => user.id === field.value);

              if (!user) return;

              return {
                label: user.name,
                id: user.id,
              };
            };

            return (
              <FormItem className="flex flex-col">
                <FormLabel>מארגן</FormLabel>
                <Combobox
                  items={users?.map(({ name, id }) => ({
                    label: name,
                    id,
                  }))}
                  selectedItem={getSelectedUser()}
                  onChange={(value) => {
                    form.setValue("userId", value);
                  }}
                />
                <FormDescription>בחר מארגן</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="dateToBeDone"
          render={({ field }) => {
            const handleTimeChange: React.ChangeEventHandler<
              HTMLInputElement
            > = (e) => {
              const time = e.target.value;
              if (!time) {
                form.setValue(
                  "dateToBeDone",
                  new Date(
                    field.value.getFullYear(),
                    field.value.getMonth(),
                    field.value.getDate()
                  )
                );
                return;
              }

              const [hours, minutes] = time
                .split(":")
                .map((str) => parseInt(str, 10));
              const newSelectedDate = new Date(
                field.value.getFullYear(),
                field.value.getMonth(),
                field.value.getDate(),
                hours,
                minutes
              );

              form.setValue("dateToBeDone", newSelectedDate);
            };

            const handleDateChange: SelectSingleEventHandler = (e) => {
              if (!e) {
                form.resetField("dateToBeDone");
                return;
              }
              const newSelectedDate = new Date(
                e?.getFullYear(),
                e?.getMonth(),
                e?.getDate(),
                field.value.getHours(),
                field.value.getMinutes()
              );

              form.setValue("dateToBeDone", newSelectedDate);
            };

            return (
              <FormItem className="flex flex-col">
                <FormLabel>תאריך</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "Pp", { locale: he })
                        ) : (
                          <span>בחר תאריך</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date < new Date() && sessionData?.user.role !== "ADMIN"
                      }
                      footer={
                        <Input
                          type="time"
                          value={format(field.value, "HH:mm", { locale: he })}
                          onChange={handleTimeChange}
                        />
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>התאריך שבו השתיה תקרה</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {sessionData?.user.role === "ADMIN" && (
          <FormField
            control={form.control}
            name="wasDone"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>האם נעשה</FormLabel>
                  <FormDescription>זה ישפיע על האם השתיה נספרת</FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}
        {footer}
      </form>
    </Form>
  );
};

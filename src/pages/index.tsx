import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import NiceModal from "@ebay/nice-modal-react";
import { AddToastModal } from "~/modals/toasts";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { ToastCard, ToastCardSkelton } from "~/components/toast-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Criminals } from "~/components/criminals";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const take = 10;
const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const [skip, setSkip] = useState(0);

  const { data, isLoading } = api.toast.getAll.useQuery({ skip, take });
  const { data: leaderBoard, isLoading: isLoadingLeaderBoard } =
    api.toast.getLeaderBoard.useQuery();

  const [parent] = useAutoAnimate();

  return (
    <div className="flex flex-col items-center justify-center gap-12 text-center">
      <h1 className="text-3xl font-bold tracking-tight xl:text-5xl">
        אפלקציית מעקב שתיות
      </h1>

      {isLoadingLeaderBoard ? (
        <Skeleton className="h-9 w-40" />
      ) : (
        <div>
          <span className="text-4xl font-bold">
            {leaderBoard?.maxPeriod.toasts}
          </span>
          <span className="text-4xl font-bold"> / </span>
          <span className="text-4xl font-bold">
            {/* TODO: remove hard coded toasts */}
            {(leaderBoard?.toastCountInThisPeriod ?? 0) + 29}
          </span>
        </div>
      )}

      <ScrollArea
        hasThumb={false}
        orientation="horizontal"
        className=" min-w-[400px] max-w-[60vw]  rounded-md"
      >
        <div className="flex flex-row items-center gap-4 p-6" ref={parent}>
          {isLoading &&
            Array.from({ length: 7 }, (_, i) => <ToastCardSkelton key={i} />)}
          {data && data.map((toast) => <ToastCard key={toast.id} {...toast} />)}
        </div>
      </ScrollArea>
      {sessionData?.user.role === "ADMIN" && (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSkip((prev) => prev - take);
            }}
            disabled={skip === 0}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              setSkip((prev) => prev + take);
            }}
            disabled={data?.length === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        {sessionData && (
          <Button
            variant="secondary"
            onClick={() => NiceModal.show(AddToastModal)}
          >
            הוספת שתיה
          </Button>
        )}
        <Criminals />
      </div>
    </div>
  );
};

export default Home;

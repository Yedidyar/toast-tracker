import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import NiceModal from "@ebay/nice-modal-react";
import { AddToastModal } from "~/modals/toasts";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { ToastCard } from "~/components/toast-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserNav } from "~/components/user-nav";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data } = api.toast.getAll.useQuery();
  const { data: currentToastCount } = api.toast.getCurrentCount.useQuery();

  return (
    <>
      <Head>
        <title>אפלקציית מעקב שתיות</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen select-none flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              {sessionData ? (
                <UserNav {...sessionData} />
              ) : (
                <Button onClick={() => signIn()}>התחבר</Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            אפלקציית מעקב שתיות
          </h1>

          <div>
            <h2 className="text-4xl font-bold">{currentToastCount}/0</h2>
          </div>

          <ScrollArea
            orientation="horizontal"
            className=" min-w-[400px] max-w-[60vw]  rounded-md"
          >
            <div className="flex flex-row items-center gap-4 p-6">
              {data &&
                data.map((toast) => <ToastCard key={toast.id} {...toast} />)}
            </div>
          </ScrollArea>
          <div className="flex flex-col items-center gap-2">
            {sessionData && (
              <Button
                variant="secondary"
                onClick={() => NiceModal.show(AddToastModal)}
              >
                הוספת שתיה
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

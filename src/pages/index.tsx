import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import NiceModal from "@ebay/nice-modal-react";
import { AddToastModal } from "~/modals/add-toast";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { ToastCard } from "~/components/toast-card";
import { ScrollArea } from "~/components/ui/scroll-area";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data } = api.toast.getAll.useQuery();

  return (
    <>
      <Head>
        <title>אפלקציית מעקב שתיות</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-12 text-center">
          <h1>
            אפלקציית מעקב <span>שתיות</span>
          </h1>
          {sessionData && (
            <Button
              variant="secondary"
              onClick={() => void NiceModal.show(AddToastModal)}
            >
              הוספת שתיה
            </Button>
          )}
          <ScrollArea
            orientation="horizontal"
            className="min-w-[400px] max-w-[60vw] rounded-md border"
          >
            <div className="flex flex-row gap-4">
              {data &&
                data.map((toast) => <ToastCard key={toast.id} {...toast} />)}
            </div>
          </ScrollArea>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl ">
        {sessionData && <span>מחובר כ {sessionData.user?.name}</span>}
      </p>
      <Button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "התנתק" : "התחבר"}
      </Button>
    </div>
  );
};

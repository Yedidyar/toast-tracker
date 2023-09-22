import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Varela_Round } from "@next/font/google";
import NiceModal from "@ebay/nice-modal-react";
import { AddToastModal } from "~/modals/add-toast";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

const varelaRound = Varela_Round({ weight: ["400"], subsets: ["hebrew"] });

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data } = api.toast.getAllByUser.useQuery();

  return (
    <>
      <Head>
        <title>אפלקציית מעקב שתיות</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${varelaRound.className} flex min-h-screen flex-col items-center justify-center `}
      >
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
          <h1>
            אפלקציית מעקב <span>שתיות</span>
          </h1>
          <div>
            {sessionData && (
              <Button
                variant="secondary"
                onClick={() => void NiceModal.show(AddToastModal)}
              >
                הוספת שתיה
              </Button>
            )}
          </div>

          {data &&
            data.map(({ occasion: { name }, dateToBeDone, wasDone, id }) => (
              <div key={id}>
                <span>{name}</span>
                <span>{dateToBeDone.toISOString()}</span>
                <span>{wasDone ? "✅" : "❌"}</span>
              </div>
            ))}
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

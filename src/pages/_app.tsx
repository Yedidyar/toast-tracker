import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import NiceModal, { show } from "@ebay/nice-modal-react";
import { ThemeProvider } from "~/components/theme-provider";
import Layout from "~/components/layout";
import { useReadLocalStorage } from "usehooks-ts";
import { TermsAndConditionsModal, termsAndConditionsLocalStorageKey } from "~/modals/terms-and-conditions";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const showTermsAndConditions = useReadLocalStorage<boolean | null>(
    termsAndConditionsLocalStorageKey
  );

  useEffect(() => {
    if (showTermsAndConditions !== false) {
      void show(TermsAndConditionsModal);
    }
  }, [showTermsAndConditions]);

  return (
    <SessionProvider session={session}>
      <NiceModal.Provider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </NiceModal.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

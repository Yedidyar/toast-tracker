import { createTRPCRouter } from "./trpc";
import { toast } from "./routers/toast";
import { occasion } from "./routers/occasion";
import { user } from "./routers/user";
import { criminal } from "./routers/criminal";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  toast,
  occasion,
  user,
  criminal,
});

// export type definition of API
export type AppRouter = typeof appRouter;

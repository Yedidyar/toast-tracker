import { createTRPCRouter } from "./trpc";
import { toast } from "./routers/toast";
import { occasion } from "./routers/occasion";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  toast,
  occasion,
});

// export type definition of API
export type AppRouter = typeof appRouter;

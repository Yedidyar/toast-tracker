import { createTRPCRouter, protectedProcedure } from "../trpc";
import { user as userModel } from "../../../../drizzle/schema";

export const user = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(userModel);
  }),
});

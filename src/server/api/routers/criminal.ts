import { createTRPCRouter, publicProcedure } from "../trpc";
import { criminal as criminalModel, user } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export const criminal = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(criminalModel)
      .leftJoin(user, eq(user.id, criminalModel.userId));
  }),
});

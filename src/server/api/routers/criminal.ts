import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { criminal as criminalTable, user as userTable } from "~/drizzle/schema"

export const criminal = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(criminalTable).leftJoin(userTable, eq(userTable.id, criminalTable.userId))
  }),
});

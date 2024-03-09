import { createTRPCRouter, protectedProcedure } from "../trpc";
import { occasion as occasionTable } from "~/drizzle/schema"

export const occasion = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(occasionTable);
  }),
});

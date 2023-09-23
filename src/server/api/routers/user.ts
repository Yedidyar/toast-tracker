import { createTRPCRouter, protectedProcedure } from "../trpc";

export const user = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});

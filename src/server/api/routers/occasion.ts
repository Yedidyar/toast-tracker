import { createTRPCRouter, protectedProcedure } from "../trpc";

export const occasion = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.occasion.findMany();
  }),
});

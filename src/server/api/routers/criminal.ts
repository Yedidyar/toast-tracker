import { createTRPCRouter, publicProcedure } from "../trpc";

export const criminal = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.criminal.findMany({
      include: { user: { select: { name: true } } },
    });
  }),
});

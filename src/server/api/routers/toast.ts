import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const toast = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.toast.findMany({
      include: {
        occasion: { select: { name: true } },
        user: { select: { name: true } },
      },
    });
  }),
  getAllByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.toast.findMany({
      where: { userId: ctx.session.user.id },
      include: { occasion: { select: { name: true } } },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        dateToBeDone: z.date(),
        occasionId: z.string(),
      })
    )
    .mutation(({ ctx, input: { dateToBeDone, occasionId } }) => {
      return ctx.prisma.toast.create({
        data: {
          dateToBeDone,
          userId: ctx.session.user.id,
          occasionId: occasionId,
        },
      });
    }),
});

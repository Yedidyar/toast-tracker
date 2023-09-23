import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const getStartOfPeriod = () => {
  const currentDate = new Date();

  if (currentDate.getMonth() >= 5) {
    return new Date(currentDate.getFullYear(), 5);
  }

  return new Date(currentDate.getFullYear(), 0);
};

export const toast = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
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
        userId: z.string(),
        wasDone: z.boolean().optional(),
      })
    )
    .mutation(
      async ({ ctx, input: { dateToBeDone, occasionId, wasDone, userId } }) => {
        return ctx.prisma.toast.create({
          data: {
            dateToBeDone,
            userId,
            occasionId,
            wasDone,
          },
        });
      }
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        dateToBeDone: z.date(),
        occasionId: z.string(),
        wasDone: z.boolean().optional(),
      })
    )
    .mutation(
      async ({ ctx, input: { dateToBeDone, occasionId, wasDone, id } }) => {
        return ctx.prisma.toast.update({
          where: {
            id,
          },
          data: {
            dateToBeDone,
            userId: ctx.session.user.id,
            occasionId: occasionId,
            wasDone,
          },
        });
      }
    ),
  getCurrentCount: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.toast.count({
      where: {
        AND: [
          {
            wasDone: true,
          },
          {
            dateToBeDone: { gte: getStartOfPeriod() },
          },
        ],
      },
    });
  }),
});

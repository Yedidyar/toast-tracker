import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { periodHistory } from "~/data";
import cache from "memory-cache";

export const TOAST_COUNT_IN_THIS_PERIOD = "toastCountInThisPeriod";

const getStartOfPeriod = () => {
  const currentDate = new Date();

  if (currentDate.getMonth() >= 5) {
    return new Date(currentDate.getFullYear(), 5);
  }

  return new Date(currentDate.getFullYear(), 0);
};

const getMaxPeriod = () => {
  let max = periodHistory[0];

  periodHistory.forEach((period) => {
    const toast = max?.toasts ?? 0;
    if (period.toasts > toast) {
      max = period;
    }
  });
  if (!max) throw new Error("can't find max");

  return max;
};

export const toast = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        take: z.number(),
        skip: z.number(),
      })
    )
    .query(({ ctx, input: { skip, take } }) => {
      const isAdmin = ctx.session?.user.role === "ADMIN";

      return ctx.prisma.toast.findMany({
        include: {
          occasion: { select: { name: true } },
          user: { select: { name: true } },
        },
        orderBy: [{ dateToBeDone: "asc" }],
        take,
        skip,
        where: isAdmin
          ? {}
          : { dateToBeDone: { gte: new Date(Date.now() - 60 * 1000 * 30) } },
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
        userId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: { dateToBeDone, occasionId, wasDone, id, userId },
      }) => {
        return ctx.prisma.toast.update({
          where: {
            id,
          },
          data: {
            dateToBeDone,
            userId,
            occasionId: occasionId,
            wasDone,
          },
        });
      }
    ),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      return ctx.prisma.toast.delete({
        where: {
          id,
        },
      });
    }),
  getLeaderBoard: publicProcedure.query(async ({ ctx }) => {
    const cachedToastCountInThisPeriod = (
      cache.get as (str: string) => number | null
    )(TOAST_COUNT_IN_THIS_PERIOD);

    if (cachedToastCountInThisPeriod !== null) {
      return {
        toastCountInThisPeriod: cachedToastCountInThisPeriod,
        maxPeriod: getMaxPeriod(),
      };
    }

    const toastCountInThisPeriod = await ctx.prisma.toast.count({
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

    cache.put(TOAST_COUNT_IN_THIS_PERIOD, toastCountInThisPeriod);
    return { toastCountInThisPeriod, maxPeriod: getMaxPeriod() };
  }),
  invalidateLeaderBoard: protectedProcedure.mutation(() => {
    cache.del(TOAST_COUNT_IN_THIS_PERIOD);
  }),
});

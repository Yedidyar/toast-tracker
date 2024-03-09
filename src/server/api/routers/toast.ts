import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { periodHistory } from "~/data";
import cache from "memory-cache";
import { toast as toastTable, user, occasion } from "~/drizzle/schema";
import { and, asc, count, eq, gte } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

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
    .query(async ({ ctx, input: { skip, take } }) => {
      const isAdmin = ctx.session?.user.role === "ADMIN";
      const query = ctx.db
        .select()
        .from(toastTable)
        .orderBy(asc(toastTable.dateToBeDone))
        .limit(take)
        .offset(skip)
        .leftJoin(user, eq(user.id, toastTable.userId))
        .leftJoin(occasion, eq(occasion.id, toastTable.occasionId));

      if (!isAdmin) {
        return query.where(
          gte(toastTable.dateToBeDone, new Date(Date.now() - 60 * 1000 * 30))
        );
      }

      return query;
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
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(toastTable).values({ ...input, id: createId() });
    }),
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
        return ctx.db
          .update(toastTable)
          .set({
            dateToBeDone,
            userId,
            occasionId: occasionId,
            wasDone,
          })
          .where(eq(toastTable.id, id));
      }
    ),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      return ctx.db.delete(toastTable).where(eq(toastTable.id, id));
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

    const [toastCountInThisPeriod] = await ctx.db
      .select({ value: count() })
      .from(toastTable)
      .where(
        and(
          eq(toastTable.wasDone, true),
          gte(toastTable.dateToBeDone, getStartOfPeriod())
        )
      );

    cache.put(TOAST_COUNT_IN_THIS_PERIOD, toastCountInThisPeriod?.value);
    return {
      toastCountInThisPeriod: toastCountInThisPeriod?.value,
      maxPeriod: getMaxPeriod(),
    };
  }),
  invalidateLeaderBoard: protectedProcedure.mutation(() => {
    cache.del(TOAST_COUNT_IN_THIS_PERIOD);
  }),
});

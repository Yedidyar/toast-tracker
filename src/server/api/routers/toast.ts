import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const toast = createTRPCRouter({
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

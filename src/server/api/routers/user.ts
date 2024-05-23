import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { withCursorPagination } from "drizzle-pagination";
import { users } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { type inferRouterOutputs } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        name: input.name,
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: (fields) => sql`${fields.id} = ${input.id}`,
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(sql`${users.id} = ${input.id}`);
    }),
  list: publicProcedure
    .input(
      z.object({
        // Cursor: The cursor from where to start fetching the users.
        // This will progressively increase as we fetch more users.
        cursor: z.number().optional(),
        // Limit: The number of users to fetch. The default value is 5.
        limit: z.number().min(1).max(50).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      // de-strucutre the input
      const { cursor, limit } = input;

      const data = await ctx.db.query.users.findMany(
        // use the withCursorPagination function to paginate the responses
        // read more about it here: https://github.com/miketromba/drizzle-pagination
        withCursorPagination({
          limit,
          cursors: [
            [
              // by which column to sort the users
              users.id,
              // in which order we should sort, "asc" or "desc"
              "desc",
              // the cursor from where to start fetching the users
              cursor ? cursor : undefined,
            ],
          ],
        }),
      );

      return {
        // return the data
        data,
        // return the next cursor
        nextCursor: data.length ? data[data.length - 1]?.id : null,
      };
    }),
});

export type UserRouterOutput = inferRouterOutputs<typeof userRouter>;

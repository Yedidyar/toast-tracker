import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import {
  account as accountTable,
  session as sessions,
  user as userTable,
  verificationToken as verificationTokenTable,
} from "~/drizzle/schema";
import type { Adapter } from "next-auth/adapters";
import type { DB } from "~/server/db";

export function DrizzleAdapter(db: DB): Adapter {
  return {
    async createUser(userData) {
      if (!userData.name) {
        throw new Error();
      }

      await db.insert(userTable).values({
        id: createId(),
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name,
        image: userData.image,
        role: userData.role,
      });
      const rows = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, userData.email))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("User not found");

      return row;
    },
    async getUser(id) {
      const rows = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByEmail(email) {
      const rows = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const rows = await db
        .select()
        .from(userTable)
        .innerJoin(accountTable, eq(userTable.id, accountTable.userId))
        .where(
          and(
            eq(accountTable.providerAccountId, providerAccountId),
            eq(accountTable.provider, provider)
          )
        )
        .limit(1);
      const row = rows[0];
      return row?.User ?? null;
    },
    async updateUser({ id, name, ...userData }) {
      if (!id) throw new Error("User not found");
      await db
        .update(userTable)
        .set({
          ...userData,
          name: name ?? undefined,
        })
        .where(eq(userTable.id, id));
      const rows = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("User not found");
      return row;
    },
    async deleteUser(userId) {
      await db.delete(userTable).where(eq(userTable.id, userId));
    },
    async linkAccount(account) {
      await db.insert(accountTable).values({
        id: createId(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refreshToken: account.refresh_token ?? null,
        accessToken: account.access_token ?? null,
        expiresAt: (account.expires_in as number) ?? null,
        tokenType: account.token_type ?? null,
        scope: account.scope ?? null,
        idToken: account.id_token ?? null,
        sessionState: account.session_state ?? null,
      });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(accountTable)
        .where(
          and(
            eq(accountTable.providerAccountId, providerAccountId),
            eq(accountTable.provider, provider)
          )
        );
    },
    async createSession(data) {
      await db.insert(sessions).values({
        id: createId(),
        expires: data.expires,
        sessionToken: data.sessionToken,
        userId: data.userId,
      });
      const rows = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("User not found");
      return row;
    },
    async getSessionAndUser(sessionToken) {
      const rows = await db
        .select({
          session: {
            id: sessions.id,
            userId: sessions.userId,
            sessionToken: sessions.sessionToken,
            expires: sessions.expires,
          },
          userTable,
        })
        .from(sessions)
        .innerJoin(userTable, eq(userTable.id, sessions.userId))
        .where(eq(sessions.sessionToken, sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      const { session, userTable: user } = row;
      return {
        user,
        session: {
          id: session.id,
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
      };
    },
    async updateSession(session) {
      await db
        .update(sessions)
        .set(session)
        .where(eq(sessions.sessionToken, session.sessionToken));
      const rows = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("Coding bug: updated session not found");
      return row;
    },
    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },
    async createVerificationToken(verificationToken) {
      await db.insert(verificationTokenTable).values({
        expires: verificationToken.expires,
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      });
      const rows = await db
        .select()
        .from(verificationTokenTable)
        .where(eq(verificationTokenTable.token, verificationToken.token))
        .limit(1);
      const row = rows[0];
      if (!row)
        throw new Error("Coding bug: inserted verification token not found");
      return row;
    },
    async useVerificationToken({ identifier, token }) {
      const rows = await db
        .select()
        .from(verificationTokenTable)
        .where(eq(verificationTokenTable.token, token))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      await db
        .delete(verificationTokenTable)
        .where(
          and(
            eq(verificationTokenTable.token, token),
            eq(verificationTokenTable.identifier, identifier)
          )
        );
      return row;
    },
  };
}

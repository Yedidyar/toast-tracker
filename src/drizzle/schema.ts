import {
  mysqlTable,
  index,
  primaryKey,
  unique,
  varchar,
  text,
  int,
  mysqlEnum,
  datetime,
  boolean,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const account = mysqlTable(
  "Account",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 191 }),
  },
  (table) => {
    return {
      userIdIdx: index("Account_userId_idx").on(table.userId),
      accountId: primaryKey({ columns: [table.id], name: "Account_id" }),
      accountProviderProviderAccountIdKey: unique(
        "Account_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId),
    };
  }
);

export const criminal = mysqlTable(
  "Criminal",
  {
    id: varchar("id", { length: 191 }).notNull(),
    type: mysqlEnum("type", ["REGULAR", "PERSONA_NON_GRATA"]).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      criminalId: primaryKey({ columns: [table.id], name: "Criminal_id" }),
      criminalUserIdKey: unique("Criminal_userId_key").on(table.userId),
    };
  }
);

export const occasion = mysqlTable(
  "Occasion",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      occasionId: primaryKey({ columns: [table.id], name: "Occasion_id" }),
    };
  }
);

export const session = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("Session_userId_idx").on(table.userId),
      sessionId: primaryKey({ columns: [table.id], name: "Session_id" }),
      sessionSessionTokenKey: unique("Session_sessionToken_key").on(
        table.sessionToken
      ),
    };
  }
);

export const toast = mysqlTable(
  "Toast",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    occasionId: varchar("occasionId", { length: 191 }).notNull(),
    dateToBeDone: datetime("dateToBeDone", { mode: "date", fsp: 3 }).notNull(),
    wasDone: boolean("wasDone").default(false).notNull(),
    createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "date" })
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      occasionIdIdx: index("Toast_occasionId_idx").on(table.occasionId),
      userIdIdx: index("Toast_userId_idx").on(table.userId),
      toastId: primaryKey({ columns: [table.id], name: "Toast_id" }),
    };
  }
);

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: datetime("emailVerified", { mode: "date", fsp: 3 }),
    image: varchar("image", { length: 191 }),
    role: mysqlEnum("role", ["USER", "ADMIN"]).default("USER").notNull(),
  },
  (table) => {
    return {
      userId: primaryKey({ columns: [table.id], name: "User_id" }),
      userEmailKey: unique("User_email_key").on(table.email),
    };
  }
);

export const verificationToken = mysqlTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "date", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      verificationTokenIdentifierTokenKey: unique(
        "VerificationToken_identifier_token_key"
      ).on(table.identifier, table.token),
      verificationTokenTokenKey: unique("VerificationToken_token_key").on(
        table.token
      ),
    };
  }
);

export type User = typeof user.$inferSelect;
export type Toast = typeof toast.$inferInsert;
export type Occasion = typeof occasion.$inferInsert;
export type Criminal = typeof criminal.$inferInsert;

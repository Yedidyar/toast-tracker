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
  tinyint,
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
      accountIdPk: primaryKey({ columns: [table.id], name: "Account_id_pk" }),
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
      criminalIdPk: primaryKey({ columns: [table.id], name: "Criminal_id_pk" }),
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
      occasionIdPk: primaryKey({ columns: [table.id], name: "Occasion_id_pk" }),
    };
  }
);

export const session = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("Session_userId_idx").on(table.userId),
      sessionIdPk: primaryKey({ columns: [table.id], name: "Session_id_pk" }),
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
    dateToBeDone: datetime("dateToBeDone", {
      mode: "string",
      fsp: 3,
    }).notNull(),
    wasDone: tinyint("wasDone").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("Toast_userId_idx").on(table.userId),
      occasionIdIdx: index("Toast_occasionId_idx").on(table.occasionId),
      toastIdPk: primaryKey({ columns: [table.id], name: "Toast_id_pk" }),
    };
  }
);

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }),
    emailVerified: datetime("emailVerified", { mode: "string", fsp: 3 }),
    image: varchar("image", { length: 191 }),
    role: mysqlEnum("role", ["USER", "ADMIN"]).default("USER").notNull(),
  },
  (table) => {
    return {
      userIdPk: primaryKey({ columns: [table.id], name: "User_id_pk" }),
      userEmailKey: unique("User_email_key").on(table.email),
    };
  }
);

export const verificationToken = mysqlTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      verificationTokenTokenKey: unique("VerificationToken_token_key").on(
        table.token
      ),
      verificationTokenIdentifierTokenKey: unique(
        "VerificationToken_identifier_token_key"
      ).on(table.identifier, table.token),
    };
  }
);

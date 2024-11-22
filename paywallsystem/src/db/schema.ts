import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

// Define user table
export const users = pgTable("user", {
  id: text("id").primaryKey(), // Primary key should be explicitly managed (use UUID in app or DB default).
  name: text("name").notNull(), // Ensure `name` is not null if required.
  email: text("email").unique().notNull(), // `email` should not be nullable.
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isPremium: boolean("isPremium").$defaultFn(()=>false), // Default to false for free users
});

// Define accounts table
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
    type: text("type").notNull(), // Removed `$type` as it's implicit in your schema type.
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"), // Nullable fields
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    isPremium: boolean("isPremium").default(false), // Consistency for premium feature
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId), // Compound key for provider uniqueness
  })
);

// Define sessions table
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Define verificationTokens table
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePK: primaryKey(verificationToken.identifier, verificationToken.token), // Composite primary key
  })
);

// Define authenticators table
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(), // Unique credential ID
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports[]"), // Changed to array type to support multiple transport modes.
  },
  (authenticator) => ({
    compositePK: primaryKey(authenticator.userId, authenticator.credentialID), // Composite primary key
  })
);

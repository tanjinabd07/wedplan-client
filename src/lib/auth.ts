import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI;
const authSecret = process.env.BETTER_AUTH_SECRET;
const authUrl = process.env.BETTER_AUTH_URL;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET is missing from environment variables");
}

if (!authUrl) {
  throw new Error("BETTER_AUTH_URL is missing from environment variables");
}

const client = new MongoClient(mongoUri);
const db = client.db("wedplan");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: authSecret,
  baseURL: authUrl,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },

      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const body = ctx.body as { role?: string } | undefined;
      const requestedRole = body?.role ?? "customer";

      if (requestedRole !== "customer" && requestedRole !== "vendor") {
        throw new APIError("BAD_REQUEST", {
          message: "Invalid signup role",
        });
      }

      return {
        context: {
          ...ctx,
          body: {
            ...ctx.body,
            role: requestedRole,
          },
        },
      };
    }),
  },
});

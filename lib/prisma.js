import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma Client for Next.js.
 *
 * In development, Next.js hot-reload creates new module instances on every
 * change, which would exhaust the DB connection pool quickly.
 * We attach the client to the global object so it survives hot-reloads.
 */

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  prisma = global.prisma;
}

export default prisma;

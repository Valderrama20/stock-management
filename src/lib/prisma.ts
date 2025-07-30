import { PrismaClient } from "@prisma/client";

declare global {
  // Extendemos globalThis para evitar múltiples instancias en dev
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // opcional
  });

// Guarda la instancia en globalThis (sólo en dev)
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

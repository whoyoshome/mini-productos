import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: { url: process.env.DATABASE_URL ?? "file:./dev.db" },
  migrations: {
    seed: "tsx --env-file=.env prisma/seed.ts",
  },
});

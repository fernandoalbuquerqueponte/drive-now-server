import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

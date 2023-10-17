import type { Config } from "drizzle-kit";

export default {
  schema: "./apps/ddd/src/infra/db/*",
  out: "./drizzle",
} satisfies Config;

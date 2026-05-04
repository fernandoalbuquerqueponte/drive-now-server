import { execSync } from "node:child_process";

async function init() {
  try {
    execSync("docker compose up -d --wait postgres-test");
    execSync("npx prisma db push --accept-data-loss");
    console.log("Banco sincronizado!");
  } catch (error) {
    console.error("Error during global setup:", error);
    process.exit(1);
  }
}

export default init;

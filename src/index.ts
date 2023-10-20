import { startExpress } from "./express";

async function main() {
  await startExpress();
}

if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

import { app } from "../src/server";
import connectDB from "../src/config/database";
import { ensureAdmin } from "../src/utils/bootstrapAdmin";

console.log("Vercel API starting...");
console.log("Vercel: ADMIN_EMAIL present:", !!process.env.ADMIN_EMAIL);
console.log("Vercel: ADMIN_PASSWORD present:", !!process.env.ADMIN_PASSWORD);

connectDB().then(async () => {
  console.log("Vercel: DB connected. Calling ensureAdmin...");
  await ensureAdmin();
});

export default app;

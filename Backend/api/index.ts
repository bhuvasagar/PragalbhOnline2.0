import { app } from "../src/server";
import connectDB from "../src/config/database";
import { ensureAdmin } from "../src/utils/bootstrapAdmin";

connectDB().then(() => ensureAdmin());

export default app;

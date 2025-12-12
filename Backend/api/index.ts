import { app } from "../src/server";
import connectDB from "../src/config/database";

connectDB();

export default app;

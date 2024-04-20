import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from "@/db/schema";

const expoDb = openDatabaseSync("jlpt4.db");
export const db = drizzle(expoDb, { schema });

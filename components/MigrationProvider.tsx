import { migrate, useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";
import { View, Text } from "react-native";
import React from "react";
import { db } from "@/services/db";
import SeedProvider from "./SeedProvider";

export default function MigrationProvider({
  children,
}: React.PropsWithChildren) {
  const { success, error } = useMigrations(db, migrations);
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  // Seed after migrations if needed
  return <SeedProvider>{children}</SeedProvider>;
}

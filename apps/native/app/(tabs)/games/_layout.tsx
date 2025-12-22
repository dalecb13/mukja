import { Stack } from "expo-router";

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#000000",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Games",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Game Details",
        }}
      />
      <Stack.Screen
        name="[id]/share"
        options={{
          title: "Share Game",
        }}
      />
      <Stack.Screen
        name="new/index"
        options={{
          title: "New Game - Filters",
        }}
      />
      <Stack.Screen
        name="new/map"
        options={{
          title: "New Game - Map",
        }}
      />
      <Stack.Screen
        name="new/review"
        options={{
          title: "Review Game",
        }}
      />
    </Stack>
  );
}


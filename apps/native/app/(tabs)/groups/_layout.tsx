import { Stack } from "expo-router";

export default function GroupsLayout() {
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
          title: "Groups",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Group Details",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Create Group",
        }}
      />
    </Stack>
  );
}


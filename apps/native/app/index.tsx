import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "./contexts/AuthContext";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // User is not authenticated, redirect to login
      router.replace("/login");
    } else {
      // User is authenticated, redirect to home tab
      // In Expo Router, route groups don't appear in URLs, so /(tabs)/index.tsx is at /
      router.replace("/(tabs)/");
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000000" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#000000",
  },
});

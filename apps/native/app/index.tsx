import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Native() {
  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.header}>🍽️ Mukja</Text>
        <Text style={styles.subtitle}>Find your next meal</Text>

        <View style={styles.buttonContainer}>
          <Link href="/search" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Search Restaurants</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <StatusBar style="auto" />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 42,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

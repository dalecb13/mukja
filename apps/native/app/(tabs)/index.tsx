import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import ProtectedRoute from "../components/ProtectedRoute";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>🍽️ Mukja</Text>
          <Text style={styles.subtitle}>Find your next meal</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(tabs)/games/new")}
            >
              <Text style={styles.primaryButtonText}>Start New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(tabs)/games")}
            >
              <Text style={styles.secondaryButtonText}>View My Games</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/(tabs)/history")}
            >
              <Text style={styles.secondaryButtonText}>Game History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 42,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    gap: 12,
    marginBottom: 40,
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
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  recentActivity: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
});


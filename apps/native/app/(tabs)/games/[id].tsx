import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function GameDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: Fetch game details from API
  const game = null;

  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}>
        {!game ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Game not found</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>Game Details</Text>
            <Text style={styles.gameId}>Game ID: {id}</Text>
            {/* TODO: Display game details, participants, restaurant results */}
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => router.push(`/(tabs)/games/${id}/share`)}
            >
              <Text style={styles.shareButtonText}>Share Game</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  gameId: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  shareButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});


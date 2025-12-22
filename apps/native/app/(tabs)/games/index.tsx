import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function GamesScreen() {
  const router = useRouter();
  // TODO: Fetch games from API
  const games: any[] = [];

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={() => router.push("/(tabs)/games/new")}
          >
            <Text style={styles.newGameButtonText}>+ New Game</Text>
          </TouchableOpacity>
        </View>

        {games.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No games yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first game to get started!
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/(tabs)/games/new")}
            >
              <Text style={styles.createButtonText}>Create Game</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gameCard}
                onPress={() => router.push(`/(tabs)/games/${item.id}`)}
              >
                <Text style={styles.gameTitle}>{item.name || "Untitled Game"}</Text>
                <Text style={styles.gameMeta}>
                  {item.participants?.length || 0} participants
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  newGameButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  newGameButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: 20,
  },
  gameCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  gameMeta: {
    fontSize: 14,
    color: "#666666",
  },
});


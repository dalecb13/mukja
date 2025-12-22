import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function HistoryScreen() {
  // TODO: Fetch game history from API
  const history: any[] = [];

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No game history yet</Text>
            <Text style={styles.emptySubtext}>
              Your past games and restaurant recommendations will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <Text style={styles.historyTitle}>
                  {item.gameName || "Game"}
                </Text>
                <Text style={styles.historyDate}>
                  {item.date || "Date"}
                </Text>
                {item.recommendations && item.recommendations.length > 0 && (
                  <View style={styles.recommendations}>
                    <Text style={styles.recommendationsTitle}>
                      Recommendations:
                    </Text>
                    {item.recommendations.slice(0, 3).map((rec: any, idx: number) => (
                      <Text key={idx} style={styles.recommendationItem}>
                        • {rec.name}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
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
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
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
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  recommendations: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  recommendationItem: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
});


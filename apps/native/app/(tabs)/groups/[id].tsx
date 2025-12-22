import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: Fetch group details from API
  const group = null;

  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}>
        {!group ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Group not found</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>Group Details</Text>
            <Text style={styles.groupId}>Group ID: {id}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Members</Text>
              {/* TODO: Display group members */}
              <Text style={styles.emptyText}>No members yet</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Games</Text>
              {/* TODO: Display games in this group */}
              <Text style={styles.emptyText}>No games yet</Text>
            </View>
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
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  groupId: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});


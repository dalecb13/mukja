import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function GroupsScreen() {
  const router = useRouter();
  // TODO: Fetch groups from API
  const groups: any[] = [];

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.newGroupButton}
            onPress={() => router.push("/(tabs)/groups/create")}
          >
            <Text style={styles.newGroupButtonText}>+ New Group</Text>
          </TouchableOpacity>
        </View>

        {groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No groups yet</Text>
            <Text style={styles.emptySubtext}>
              Create a group to organize games with friends
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/(tabs)/groups/create")}
            >
              <Text style={styles.createButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.groupCard}
                onPress={() => router.push(`/(tabs)/groups/${item.id}`)}
              >
                <Text style={styles.groupTitle}>{item.name || "Untitled Group"}</Text>
                <Text style={styles.groupMeta}>
                  {item.members?.length || 0} members •{" "}
                  {item.games?.length || 0} games
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
  newGroupButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  newGroupButtonText: {
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
  groupCard: {
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
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 14,
    color: "#666666",
  },
});


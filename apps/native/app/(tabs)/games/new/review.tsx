import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function NewGameReviewScreen() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  // TODO: Get filters and map area from navigation state or context

  const handleCreateGame = async () => {
    setCreating(true);
    try {
      // TODO: Call API to create game
      // const game = await createGame({ filters, mapArea, createGroup });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert("Success", "Game created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // TODO: Navigate to game detail page
            router.replace("/(tabs)/games");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create game. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Review Game Settings</Text>
            <Text style={styles.subtitle}>
              Review your selections before creating the game
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Restaurant Filters</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>Cuisine: (to be loaded)</Text>
                <Text style={styles.infoText}>Price Range: (to be loaded)</Text>
                <Text style={styles.infoText}>Min Rating: (to be loaded)</Text>
                <Text style={styles.infoText}>
                  Dietary Restrictions: (to be loaded)
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Map Area</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Area selected: ✓ (coordinates to be loaded)
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  createGroup && styles.checkboxContainerActive,
                ]}
                onPress={() => setCreateGroup(!createGroup)}
              >
                <Text style={styles.checkboxText}>
                  {createGroup ? "✓" : "○"} Create or invite to a group
                </Text>
              </TouchableOpacity>
              <Text style={styles.checkboxSubtext}>
                Allow others to join this game and form a group
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createButton, creating && styles.createButtonDisabled]}
            onPress={handleCreateGame}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.createButtonText}>Create Game</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
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
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  checkboxContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  checkboxContainerActive: {
    borderColor: "#000000",
    backgroundColor: "#f5f5f5",
  },
  checkboxText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  checkboxSubtext: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 16,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});


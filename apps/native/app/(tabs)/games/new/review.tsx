import { useState, useMemo } from "react";
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
import { useGameCreation } from "../../../contexts/GameCreationContext";
import { gamesApi } from "../../../../lib/api";

// Calculate approximate area of polygon
function calculatePolygonArea(
  coordinates: [[number, number][]]
): number {
  if (!coordinates[0] || coordinates[0].length < 3) return 0;

  const R = 6371; // Earth radius in km
  let area = 0;
  const points = coordinates[0].map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const lat1 = (points[i].latitude * Math.PI) / 180;
    const lat2 = (points[j].latitude * Math.PI) / 180;
    const dLon = ((points[j].longitude - points[i].longitude) * Math.PI) / 180;

    area +=
      Math.atan2(
        Math.sin(dLon) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
      ) * R * R;
  }

  return Math.abs(area);
}

export default function NewGameReviewScreen() {
  const router = useRouter();
  const { filters, mapArea, createGroup, setCreateGroup, reset } = useGameCreation();
  const [creating, setCreating] = useState(false);

  const mapAreaInfo = useMemo(() => {
    if (!mapArea || mapArea.type !== "Polygon" || !mapArea.coordinates[0]) {
      return null;
    }

    const pointCount = mapArea.coordinates[0].length;
    const areaKm2 = calculatePolygonArea(mapArea.coordinates);
    const bounds = mapArea.coordinates[0].reduce(
      (acc, [lng, lat]) => ({
        minLat: Math.min(acc.minLat, lat),
        maxLat: Math.max(acc.maxLat, lat),
        minLng: Math.min(acc.minLng, lng),
        maxLng: Math.max(acc.maxLng, lng),
      }),
      {
        minLat: Infinity,
        maxLat: -Infinity,
        minLng: Infinity,
        maxLng: -Infinity,
      }
    );

    return {
      pointCount,
      areaKm2,
      centerLat: (bounds.minLat + bounds.maxLat) / 2,
      centerLng: (bounds.minLng + bounds.maxLng) / 2,
    };
  }, [mapArea]);

  const handleCreateGame = async () => {
    if (!mapArea) {
      Alert.alert("Error", "Please select a map area first.");
      return;
    }

    setCreating(true);
    try {
      const game = await gamesApi.create({
        filters: filters,
        mapArea: mapArea,
        groupId: createGroup ? undefined : undefined, // TODO: Get actual groupId if creating group game
      });
      
      // Reset context after successful creation
      reset();
      
      Alert.alert("Success", "Game created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to game detail page or games list
            router.replace(`/(tabs)/games/${game.id}`);
          },
        },
      ]);
    } catch (error) {
      console.error("Create game error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create game. Please try again.";
      Alert.alert(
        "Error Creating Game",
        errorMessage,
        [{ text: "OK" }]
      );
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
                <Text style={styles.infoText}>
                  Cuisine: {filters.cuisine || "Not specified"}
                </Text>
                <Text style={styles.infoText}>
                  Price Range: {filters.priceRange || "Not specified"}
                </Text>
                <Text style={styles.infoText}>
                  Min Rating: {filters.minRating || "Not specified"}
                </Text>
                <Text style={styles.infoText}>
                  Dietary Restrictions:{" "}
                  {filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0
                    ? filters.dietaryRestrictions.join(", ")
                    : "None"}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Map Area</Text>
              <View style={styles.infoCard}>
                {mapAreaInfo ? (
                  <>
                    <Text style={styles.infoText}>
                      ✓ Area selected successfully
                    </Text>
                    <Text style={styles.infoText}>
                      Points: {mapAreaInfo.pointCount}
                    </Text>
                    <Text style={styles.infoText}>
                      Approximate area: {mapAreaInfo.areaKm2.toFixed(2)} km²
                    </Text>
                    <Text style={styles.infoText}>
                      Center: {mapAreaInfo.centerLat.toFixed(4)},{" "}
                      {mapAreaInfo.centerLng.toFixed(4)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.infoText}>
                    No area selected. Please go back and select an area.
                  </Text>
                )}
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


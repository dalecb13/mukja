import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function NewGameMapScreen() {
  const router = useRouter();
  const [areaSelected, setAreaSelected] = useState(false);
  // TODO: Integrate actual map component (react-native-maps or similar)
  // TODO: Store selected map area coordinates

  const handleMapAreaSelect = () => {
    // TODO: Implement map area selection
    setAreaSelected(true);
    Alert.alert("Area Selected", "Map area selection will be implemented with a map library");
  };

  const handleNext = () => {
    if (!areaSelected) {
      Alert.alert("Select Area", "Please select an area on the map first");
      return;
    }
    router.push("/(tabs)/games/new/review");
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>Select Area on Map</Text>
            <Text style={styles.subtitle}>
              Choose the geographic area for your restaurant search
            </Text>

            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>
                🗺️ Map Component
              </Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Map integration will be added here
              </Text>
              <Text style={styles.mapPlaceholderSubtext}>
                (react-native-maps or similar)
              </Text>
              <TouchableOpacity
                style={styles.selectAreaButton}
                onPress={handleMapAreaSelect}
              >
                <Text style={styles.selectAreaButtonText}>
                  {areaSelected ? "✓ Area Selected" : "Select Area"}
                </Text>
              </TouchableOpacity>
            </View>

            {areaSelected && (
              <View style={styles.selectedAreaInfo}>
                <Text style={styles.selectedAreaText}>
                  ✓ Area selected successfully
                </Text>
                <Text style={styles.selectedAreaSubtext}>
                  Coordinates will be stored here
                </Text>
              </View>
            )}
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
            style={[styles.nextButton, !areaSelected && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!areaSelected}
          >
            <Text style={styles.nextButtonText}>Next: Review</Text>
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
  mapPlaceholder: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mapPlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  selectAreaButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  selectAreaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedAreaInfo: {
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4caf50",
  },
  selectedAreaText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2e7d32",
    marginBottom: 4,
  },
  selectedAreaSubtext: {
    fontSize: 14,
    color: "#666666",
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
  nextButton: {
    flex: 1,
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});


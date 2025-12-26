import { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../../components/ProtectedRoute";

// Define Region type (react-native-maps is native-only)
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
import { useGameCreation, MapArea } from "../../../contexts/GameCreationContext";
import MapSelector from "./components/MapSelector";
import LocationSearch from "./components/LocationSearch";
import PolygonControls from "./components/PolygonControls";

// Validation constants
const MIN_POINTS = 3;
const MAX_POINTS = 50;
const MIN_AREA_KM2 = 0.01; // ~0.01 km² minimum
const MAX_AREA_KM2 = 10000; // ~10,000 km² maximum

// Calculate approximate area of polygon using shoelace formula
function calculatePolygonArea(
  points: Array<{ latitude: number; longitude: number }>
): number {
  if (points.length < 3) return 0;

  // Convert to radians and use spherical approximation
  const R = 6371; // Earth radius in km
  let area = 0;

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

// Check if polygon is valid (basic self-intersection check would be more complex)
function isValidPolygon(
  points: Array<{ latitude: number; longitude: number }>
): boolean {
  if (points.length < MIN_POINTS) return false;
  if (points.length > MAX_POINTS) return false;

  // Check for duplicate consecutive points
//   for (let i = 0; i < points.length; i++) {
//     const next = (i + 1) % points.length;
//     if (
//       Math.abs(points[i].latitude - points[next].latitude) < 0.0001 &&
//       Math.abs(points[i].longitude - points[next].longitude) < 0.0001
//     ) {
//       return false;
//     }
//   }

//   const area = calculatePolygonArea(points);
//   if (area < MIN_AREA_KM2 || area > MAX_AREA_KM2) {
//     return false;
//   }

  return true;
}

export default function NewGameMapScreen() {
  const router = useRouter();
  const { mapArea, setMapArea, clearMapArea } = useGameCreation();
  const [polygonPoints, setPolygonPoints] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const [mapRegion, setMapRegion] = useState<Region | undefined>();

  // Load existing map area from context if available
  useEffect(() => {
    if (mapArea && mapArea.type === "Polygon" && mapArea.coordinates[0]) {
      const points = mapArea.coordinates[0].map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }));
      setPolygonPoints(points);
    }
  }, []);

  // Convert polygon points to GeoJSON format and save to context
  useEffect(() => {
    if (polygonPoints.length >= MIN_POINTS) {
      // Create coordinate array and ensure polygon is closed (first point = last point)
      const coords: [number, number][] = polygonPoints.map((point) => [point.longitude, point.latitude] as [number, number]);
      // Close the polygon if not already closed
      const firstPoint = coords[0];
      const lastPoint = coords[coords.length - 1];
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        coords.push([firstPoint[0], firstPoint[1]]);
      }
      const coordinates: [[number, number][]] = [coords];
      const geoJson: MapArea = {
        type: "Polygon",
        coordinates,
      };
      setMapArea(geoJson);
    } else {
      setMapArea(null);
    }
  }, [polygonPoints, setMapArea]);

  const handlePolygonPointAdd = (point: { latitude: number; longitude: number }) => {
    if (polygonPoints.length >= MAX_POINTS) {
      Alert.alert(
        "Maximum Points Reached",
        `You can add up to ${MAX_POINTS} points. Please remove some points first.`
      );
      return;
    }
    setPolygonPoints([...polygonPoints, point]);
  };

  const handleUndo = () => {
    if (polygonPoints.length > 0) {
      setPolygonPoints(polygonPoints.slice(0, -1));
    }
  };

  const handleClear = () => {
    Alert.alert(
      "Clear Selection",
      "Are you sure you want to clear all points?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setPolygonPoints([]);
            clearMapArea();
          },
        },
      ]
    );
  };

  const handleLocationSelect = (region: Region) => {
    setMapRegion(region);
  };

  const isValid = useMemo(() => isValidPolygon(polygonPoints), [polygonPoints]);
  const areaKm2 = useMemo(
    () => calculatePolygonArea(polygonPoints),
    [polygonPoints]
  );

  // Button should be enabled when polygon is valid AND mapArea is set
  const canProceed = useMemo(() => {
    return isValid && mapArea !== null && mapArea.type === "Polygon";
  }, [isValid, mapArea]);

  const handleNext = () => {
    if (!canProceed) {
      if (polygonPoints.length < MIN_POINTS) {
        Alert.alert(
          "Incomplete Selection",
          `Please add at least ${MIN_POINTS} points to create a valid area.`
        );
      } else {
        Alert.alert(
          "Invalid Selection",
          "Please ensure your polygon area is properly selected."
        );
      }
      return;
    }
    router.push("/(tabs)/games/new/review");
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Area on Map</Text>
          <Text style={styles.subtitle}>
            Tap on the map to add points and create your search area
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <LocationSearch onLocationSelect={handleLocationSelect} />
          <MapSelector
            polygonPoints={polygonPoints}
            onPolygonPointAdd={handlePolygonPointAdd}
            onRegionChange={setMapRegion}
            initialRegion={mapRegion}
          />
        </View>

        <ScrollView style={styles.controlsScroll} contentContainerStyle={styles.controlsContent}>
          <PolygonControls
            pointCount={polygonPoints.length}
            isValid={isValid}
            onClear={handleClear}
            onUndo={handleUndo}
          />

          {isValid && (
            <View style={styles.areaInfo}>
              <Text style={styles.areaInfoTitle}>Selected Area</Text>
              <Text style={styles.areaInfoText}>
                Points: {polygonPoints.length}
              </Text>
              <Text style={styles.areaInfoText}>
                Approximate area: {areaKm2.toFixed(2)} km²
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
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
  header: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
  },
  mapContainer: {
    height: 400,
    position: "relative",
  },
  controlsScroll: {
    flex: 0,
  },
  controlsContent: {
    padding: 20,
    gap: 16,
  },
  areaInfo: {
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4caf50",
  },
  areaInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: 8,
  },
  areaInfoText: {
    fontSize: 14,
    color: "#2e7d32",
    marginBottom: 4,
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

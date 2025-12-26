import { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { MapArea } from "../../../../contexts/GameCreationContext";

// Conditionally import react-native-maps only on native platforms
let MapView: any;
let Marker: any;
let Polygon: any;
let PROVIDER_DEFAULT: any;
let Region: any;

if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polygon = Maps.Polygon;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
    Region = Maps.Region;
  } catch (e) {
    console.warn("react-native-maps not available:", e);
  }
}

// Type definition for Region (used on web too)
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapSelectorProps {
  polygonPoints: Array<{ latitude: number; longitude: number }>;
  onPolygonPointAdd: (point: { latitude: number; longitude: number }) => void;
  onRegionChange?: (region: Region) => void;
  initialRegion?: Region;
}

const DEFAULT_REGION: Region = {
  latitude: 37.7749, // San Francisco
  longitude: -122.4194,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function MapSelector({
  polygonPoints,
  onPolygonPointAdd,
  onRegionChange,
  initialRegion,
}: MapSelectorProps) {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState<Region>(
    initialRegion || DEFAULT_REGION
  );

  useEffect(() => {
    // Request location permission and get user location (native only)
    if (Platform.OS === "web") {
      setLocationLoading(false);
      return;
    }

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(coords);
          // Center map on user location
          const region: Region = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          setMapRegion(region);
          mapRef.current?.animateToRegion?.(region, 1000);
        }
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    onPolygonPointAdd({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const handleRegionChangeComplete = (region: Region) => {
    setMapRegion(region);
    onRegionChange?.(region);
  };

  // Create polygon coordinates for display (convert lat/lng to [lng, lat] for GeoJSON format)
  const polygonCoordinates = useMemo(() => {
    return polygonPoints.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    }));
  }, [polygonPoints]);

  // Create closed polygon coordinates (add first point at end to close the polygon)
  const closedPolygonCoordinates = useMemo(() => {
    if (polygonPoints.length < 3) return polygonCoordinates;
    return [...polygonCoordinates, polygonCoordinates[0]];
  }, [polygonCoordinates, polygonPoints.length]);

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      const region: Region = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setMapRegion(region);
      mapRef.current?.animateToRegion?.(region, 1000);
    }
  };

  // Web fallback
  if (Platform.OS === "web" || !MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapPlaceholderText}>🗺️</Text>
          <Text style={styles.webMapPlaceholderTitle}>Map View</Text>
          <Text style={styles.webMapPlaceholderSubtext}>
            Map functionality is only available on native platforms (iOS/Android)
          </Text>
          <Text style={styles.webMapPlaceholderSubtext}>
            Please use the mobile app to select map areas
          </Text>
          {polygonPoints.length > 0 && (
            <View style={styles.webPointsInfo}>
              <Text style={styles.webPointsInfoText}>
                Points added: {polygonPoints.length}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={mapRegion}
        region={mapRegion}
        onPress={handleMapPress}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={false}
        showsMyLocationButton={false}
        mapType="standard"
      >
        {/* Polygon markers for each point */}
        {polygonPoints.map((point, index) => (
          <Marker
            key={`point-${index}`}
            coordinate={point}
            title={`Point ${index + 1}`}
            pinColor="red"
          />
        ))}

        {/* Polygon overlay */}
        {polygonPoints.length >= 3 && (
          <Polygon
            coordinates={closedPolygonCoordinates}
            strokeColor="#FF5A5F"
            fillColor="rgba(255, 90, 95, 0.2)"
            strokeWidth={2}
          />
        )}
      </MapView>

      {/* User location button */}
      {userLocation && (
        <TouchableOpacity
          style={styles.userLocationButton}
          onPress={centerOnUserLocation}
        >
          <Text style={styles.userLocationButtonText}>📍</Text>
        </TouchableOpacity>
      )}

      {/* Loading indicator */}
      {locationLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF5A5F" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      )}

      {/* Instructions overlay */}
      {polygonPoints.length === 0 && (
        <View style={styles.instructionsOverlay}>
          <Text style={styles.instructionsText}>
            Tap on the map to add points{'\n'}to create your search area
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  userLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userLocationButtonText: {
    fontSize: 24,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 14,
  },
  instructionsOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionsText: {
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
  webMapPlaceholder: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webMapPlaceholderText: {
    fontSize: 64,
    marginBottom: 16,
  },
  webMapPlaceholderTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  webMapPlaceholderSubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 4,
  },
  webPointsInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  webPointsInfoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
});


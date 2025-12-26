import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Platform } from "react-native";

// Define Region type (react-native-maps is native-only)
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface LocationResult {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationSearchProps {
  onLocationSelect: (region: Region) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Use expo-location's geocoding (native only)
      if (Platform.OS === "web") {
        // Web fallback: show message that geocoding requires native platform
        setResults([{
          name: query,
          latitude: 0,
          longitude: 0,
          address: "Geocoding requires native platform (iOS/Android)",
        }]);
        return;
      }

      const geocodeResults = await Location.geocodeAsync(query);
      
      const formattedResults: LocationResult[] = geocodeResults.map((result, index) => {
        // Build address string from coordinates if available
        const address = `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`;
        return {
          name: query || `Location ${index + 1}`,
          latitude: result.latitude,
          longitude: result.longitude,
          address: address,
        };
      });

      setResults(formattedResults);
    } catch (error) {
      console.error("Geocoding error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationResult) => {
    const region: Region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    
    onLocationSelect(region);
    setShowResults(false);
    setSearchQuery(location.name || location.address || "");
  };

  const handleClear = () => {
    setSearchQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FF5A5F" />
          </View>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item, index) => `result-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
              >
                <Text style={styles.resultName}>{item.name}</Text>
                {item.address && (
                  <Text style={styles.resultAddress}>{item.address}</Text>
                )}
              </TouchableOpacity>
            )}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {showResults && !isSearching && results.length === 0 && searchQuery.length >= 3 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#333333",
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#666666",
  },
  loadingContainer: {
    padding: 8,
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  resultAddress: {
    fontSize: 14,
    color: "#666666",
  },
  noResultsText: {
    padding: 12,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
});


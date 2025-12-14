import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

// API base URL - change this to your native-api server address
const API_BASE_URL = __DEV__
  ? "http://localhost:3002"
  : "https://your-production-api.com";

interface SearchResult {
  location_id: string;
  name: string;
  distance?: string;
  rating?: string;
  address_obj?: {
    address_string?: string;
  };
}

interface SearchResponse {
  data: SearchResult[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchRestaurants = async () => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const params = new URLSearchParams({
        searchQuery: query,
        category: "restaurants",
      });

      const response = await fetch(
        `${API_BASE_URL}/tripadvisor/search?${params}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Search failed (${response.status})`
        );
      }

      const data: SearchResponse = await response.json();
      setResults(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <View style={styles.resultCard}>
      <Text style={styles.resultName}>{item.name}</Text>
      {item.address_obj?.address_string && (
        <Text style={styles.resultAddress}>
          📍 {item.address_obj.address_string}
        </Text>
      )}
      <View style={styles.resultMeta}>
        {item.rating && (
          <Text style={styles.resultRating}>⭐ {item.rating}</Text>
        )}
        {item.distance && (
          <Text style={styles.resultDistance}>{item.distance}</Text>
        )}
      </View>
      <Text style={styles.resultId}>ID: {item.location_id}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.title}>🍽️ Restaurant Search</Text>
          <Text style={styles.subtitle}>Powered by TripAdvisor</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants (e.g., pizza, sushi)"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchRestaurants}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={searchRestaurants}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No restaurants found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item) => item.location_id}
          renderItem={renderResult}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultsCount}>
                Found {results.length} restaurant{results.length !== 1 ? "s" : ""}
              </Text>
            ) : null
          }
        />

        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#FF5A5F",
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  resultsList: {
    padding: 15,
    paddingTop: 5,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    marginLeft: 5,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  resultAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  resultRating: {
    fontSize: 14,
    color: "#FF9500",
    fontWeight: "500",
  },
  resultDistance: {
    fontSize: 14,
    color: "#666",
  },
  resultId: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});


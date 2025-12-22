import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../../components/ProtectedRoute";

interface GameFilters {
  cuisine?: string;
  priceRange?: string;
  minRating?: string;
  dietaryRestrictions?: string[];
}

export default function NewGameFiltersScreen() {
  const router = useRouter();
  const [filters, setFilters] = useState<GameFilters>({
    cuisine: "",
    priceRange: "",
    minRating: "",
    dietaryRestrictions: [],
  });

  const handleNext = () => {
    // TODO: Store filters in context or pass via navigation state
    router.push("/(tabs)/games/new/map");
  };

  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Define Restaurant Filters</Text>
          <Text style={styles.subtitle}>
            Set your preferences for the game
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cuisine Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Italian, Japanese, Mexican"
                placeholderTextColor="#999999"
                value={filters.cuisine}
                onChangeText={(text) =>
                  setFilters({ ...filters, cuisine: text })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price Range</Text>
              <View style={styles.priceButtons}>
                {["$", "$$", "$$$", "$$$$"].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceButton,
                      filters.priceRange === price && styles.priceButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, priceRange: price })
                    }
                  >
                    <Text
                      style={[
                        styles.priceButtonText,
                        filters.priceRange === price &&
                          styles.priceButtonTextActive,
                      ]}
                    >
                      {price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Minimum Rating</Text>
              <View style={styles.ratingButtons}>
                {["3.0", "3.5", "4.0", "4.5", "5.0"].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      filters.minRating === rating && styles.ratingButtonActive,
                    ]}
                    onPress={() =>
                      setFilters({ ...filters, minRating: rating })
                    }
                  >
                    <Text
                      style={[
                        styles.ratingButtonText,
                        filters.minRating === rating &&
                          styles.ratingButtonTextActive,
                      ]}
                    >
                      {rating} ⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dietary Restrictions (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                placeholderTextColor="#999999"
                value={filters.dietaryRestrictions?.join(", ")}
                onChangeText={(text) =>
                  setFilters({
                    ...filters,
                    dietaryRestrictions: text
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next: Select Area</Text>
          </TouchableOpacity>
        </View>
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
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
  },
  priceButtons: {
    flexDirection: "row",
    gap: 8,
  },
  priceButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  priceButtonActive: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  priceButtonText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  priceButtonTextActive: {
    color: "#ffffff",
  },
  ratingButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ratingButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    minWidth: 80,
    alignItems: "center",
  },
  ratingButtonActive: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  ratingButtonText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  ratingButtonTextActive: {
    color: "#ffffff",
  },
  nextButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});


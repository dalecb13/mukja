import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function CreateGroupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    setCreating(true);
    try {
      // TODO: Call API to create group
      // const group = await createGroup({ name });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert("Success", "Group created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // TODO: Navigate to group detail page
            router.replace("/(tabs)/groups");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create New Group</Text>
          <Text style={styles.subtitle}>
            Create a group to organize games with friends
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Group Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter group name"
                placeholderTextColor="#999999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, creating && styles.createButtonDisabled]}
            onPress={handleCreateGroup}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.createButtonText}>Create Group</Text>
            )}
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
  createButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});


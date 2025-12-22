import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function ShareGameScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: Generate actual share link/invite code from API
  const shareLink = `mukja://game/${id}`;
  const inviteCode = id?.substring(0, 8).toUpperCase() || "INVITE";

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(shareLink);
    Alert.alert("Copied!", "Game link copied to clipboard");
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(inviteCode);
    Alert.alert("Copied!", "Invite code copied to clipboard");
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Share Game</Text>
          <Text style={styles.subtitle}>
            Invite others to join this game
          </Text>

          <View style={styles.shareSection}>
            <Text style={styles.sectionTitle}>Share Link</Text>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText} numberOfLines={1}>
                {shareLink}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyLink}
            >
              <Text style={styles.copyButtonText}>Copy Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shareSection}>
            <Text style={styles.sectionTitle}>Invite Code</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{inviteCode}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
            >
              <Text style={styles.copyButtonText}>Copy Code</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Done</Text>
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
    marginBottom: 32,
  },
  shareSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  linkContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    color: "#333333",
  },
  codeContainer: {
    backgroundColor: "#000000",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  codeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 4,
  },
  copyButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  copyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});


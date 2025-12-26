import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "./contexts/AuthContext";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string | undefined;

  // If there's a token, we're resetting the password (from email link)
  // Otherwise, we're requesting a password reset email
  const isResettingPassword = !!token;

  const handleRequestReset = async () => {
    setError(null);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // TODO: Implement password update with token
    // This would typically use supabase.auth.updateUser() after verifying the token
    setError("Password reset with token not yet implemented. Please use the reset link from your email.");
    setLoading(false);
  };

  if (success && !isResettingPassword) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We've sent you a password reset link. Please check your email and click the link to reset your password.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {isResettingPassword ? "Reset Password" : "Forgot Password"}
        </Text>
        <Text style={styles.subtitle}>
          {isResettingPassword
            ? "Enter your new password"
            : "Enter your email address and we'll send you a link to reset your password"}
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {!isResettingPassword && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#999999"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          )}

          {isResettingPassword && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={isResettingPassword ? handleResetPassword : handleRequestReset}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? isResettingPassword
                  ? "Resetting password..."
                  : "Sending email..."
                : isResettingPassword
                ? "Reset Password"
                : "Send Reset Link"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 32,
  },
  errorContainer: {
    padding: 12,
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#000000",
  },
  errorText: {
    color: "#000000",
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#999999",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    alignItems: "center",
  },
  linkText: {
    color: "#000000",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});



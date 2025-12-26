import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PolygonControlsProps {
  pointCount: number;
  isValid: boolean;
  onClear: () => void;
  onUndo: () => void;
}

export default function PolygonControls({
  pointCount,
  isValid,
  onClear,
  onUndo,
}: PolygonControlsProps) {
  const minPoints = 3;
  const hasPoints = pointCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Points: {pointCount} / {minPoints} minimum
        </Text>
        {isValid ? (
          <Text style={[styles.statusText, styles.statusValid]}>
            ✓ Valid polygon
          </Text>
        ) : hasPoints ? (
          <Text style={[styles.statusText, styles.statusInvalid]}>
            Add {minPoints - pointCount} more point{minPoints - pointCount !== 1 ? 's' : ''}
          </Text>
        ) : (
          <Text style={[styles.statusText, styles.statusNeutral]}>
            Start adding points
          </Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.undoButton, !hasPoints && styles.buttonDisabled]}
          onPress={onUndo}
          disabled={!hasPoints}
        >
          <Text style={[styles.buttonText, !hasPoints && styles.buttonTextDisabled]}>
            Undo Last
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton, !hasPoints && styles.buttonDisabled]}
          onPress={onClear}
          disabled={!hasPoints}
        >
          <Text style={[styles.clearButtonText, !hasPoints && styles.buttonTextDisabled]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusValid: {
    color: "#4caf50",
  },
  statusInvalid: {
    color: "#ff9800",
  },
  statusNeutral: {
    color: "#666666",
  },
  controlsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  undoButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  clearButton: {
    backgroundColor: "#ff5252",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  buttonTextDisabled: {
    color: "#999999",
  },
});


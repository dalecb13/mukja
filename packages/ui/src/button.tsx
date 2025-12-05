import * as React from "react";
import {
  StyleSheet,
  GestureResponderEvent,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { colors } from "./tokens/colors";
import { spacing } from "./tokens/spacing";
import { radii } from "./tokens/radii";
import { fontSizes, fontWeights } from "./tokens/typography";
import { shadowsNative } from "./tokens/shadows";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  text: string;
  onClick?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
}

const getVariantStyles = (
  variant: ButtonVariant,
  pressed: boolean
): { container: ViewStyle; text: TextStyle } => {
  const variants = {
    primary: {
      container: {
        backgroundColor: pressed ? colors.primary[600] : colors.primary[500],
        borderWidth: 0,
      },
      text: {
        color: colors.neutral[0],
      },
    },
    secondary: {
      container: {
        backgroundColor: pressed ? colors.secondary[200] : colors.secondary[100],
        borderWidth: 0,
      },
      text: {
        color: colors.secondary[800],
      },
    },
    outline: {
      container: {
        backgroundColor: pressed ? colors.primary[50] : "transparent",
        borderWidth: 2,
        borderColor: colors.primary[500],
      },
      text: {
        color: colors.primary[500],
      },
    },
    ghost: {
      container: {
        backgroundColor: pressed ? colors.neutral[100] : "transparent",
        borderWidth: 0,
      },
      text: {
        color: colors.primary[500],
      },
    },
  };
  return variants[variant];
};

const getSizeStyles = (
  size: ButtonSize
): { container: ViewStyle; text: TextStyle } => {
  const sizes = {
    sm: {
      container: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        minHeight: 36,
      },
      text: {
        fontSize: fontSizes.sm,
      },
    },
    md: {
      container: {
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[6],
        minHeight: 44,
      },
      text: {
        fontSize: fontSizes.base,
      },
    },
    lg: {
      container: {
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[8],
        minHeight: 52,
      },
      text: {
        fontSize: fontSizes.lg,
      },
    },
  };
  return sizes[size];
};

export function Button({
  text,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => {
        const variantStyles = getVariantStyles(variant, pressed);
        const sizeStyles = getSizeStyles(size);
        return [
          styles.button,
          variantStyles.container,
          sizeStyles.container,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          !disabled && variant === "primary" && shadowsNative.sm,
        ];
      }}
      onPress={onClick}
      disabled={disabled}
    >
      {({ pressed }) => {
        const variantStyles = getVariantStyles(variant, pressed);
        const sizeStyles = getSizeStyles(size);
        return (
          <Text
            style={[
              styles.text,
              variantStyles.text,
              sizeStyles.text,
              disabled && styles.disabledText,
            ]}
          >
            {text}
          </Text>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    flexDirection: "row",
  },
  text: {
    fontWeight: fontWeights.semibold as TextStyle["fontWeight"],
    textAlign: "center",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    backgroundColor: colors.neutral[200],
    borderColor: colors.neutral[200],
  },
  disabledText: {
    color: colors.neutral[400],
  },
});

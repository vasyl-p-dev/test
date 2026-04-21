import { FC } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { Typography, TypographyColor } from './Typography';

type PublicVariant = 'primary' | 'secondary';
type ButtonVariant = PublicVariant | 'disabled';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: PublicVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  fullWidth = true,
}) => {
  const effective: ButtonVariant = disabled || loading ? 'disabled' : variant;
  const isPrimaryShape = effective === 'primary' || effective === 'disabled';
  const { bg, fgColor, opacity } = getStyles(effective);
  const busy = !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy }}
      style={({ pressed }) => [
        styles.base,
        isPrimaryShape ? styles.primaryShape : styles.secondaryShape,
        fullWidth && styles.full,
        { backgroundColor: bg, opacity },
        pressed && !(disabled || loading) && styles.pressed,
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={colors.white.color} />
      ) : (
        <Typography
          variant={isPrimaryShape ? 'button' : 'bodySmall'}
          color={fgColor}
          style={styles.label}
        >
          {label}
        </Typography>
      )}
    </Pressable>
  );
};

function getStyles(variant: ButtonVariant): { bg: string; fgColor: TypographyColor; opacity: number } {
  switch (variant) {
    case 'primary':
      return { bg: colors.tertiary.color, fgColor: 'white.color', opacity: 1 };
    case 'secondary':
      return { bg: colors.white.color, fgColor: 'grey.extraDark', opacity: 1 };
    case 'disabled':
      return { bg: colors.tertiary.color, fgColor: 'white.color', opacity: 0.5 };
  }
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  primaryShape: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.base,
    borderRadius: radii.pill,
    minHeight: 56,
  },
  secondaryShape: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radii.chip,
  },
  full: { alignSelf: 'stretch' },
  pressed: { opacity: 0.85 },
  label: { textAlign: 'center' },
});

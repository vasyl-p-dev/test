import { FC, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../theme';
import { Typography, TypographyColor } from './Typography';

export type ToastVariant = 'success' | 'error';

export interface ToastProps {
  message: string;
  variant: ToastVariant;
  visible: boolean;
  onHide: () => void;
  durationMs?: number;
}

const FADE_MS = 220;
const DEFAULT_DURATION_MS = 3000;

export const Toast: FC<ToastProps> = ({
  message,
  variant,
  visible,
  onHide,
  durationMs = DEFAULT_DURATION_MS,
}) => {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const show = Animated.timing(progress, {
      toValue: 1,
      duration: FADE_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    const hide = Animated.timing(progress, {
      toValue: 0,
      duration: FADE_MS,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    });

    show.start();
    const dismissTimer = setTimeout(() => {
      hide.start(({ finished }) => {
        if (finished) onHide();
      });
    }, durationMs);

    return () => {
      clearTimeout(dismissTimer);
      show.stop();
      hide.stop();
      progress.setValue(0);
    };
  }, [visible, durationMs, progress, onHide]);

  if (!visible) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] });
  const { background, text } = getStyles(variant);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.wrap,
        background,
        { top: insets.top + spacing.sm, opacity: progress, transform: [{ translateY }] },
      ]}
    >
      <Typography variant="bodySmall" color={text} style={styles.text} numberOfLines={2}>
        {message}
      </Typography>
    </Animated.View>
  );
};

function getStyles(variant: ToastVariant): { background: ViewStyle; text: TypographyColor } {
  switch (variant) {
    case 'success':
      return {
        background: { backgroundColor: colors.tertiary.color },
        text: 'white.color',
      };
    case 'error':
      return {
        background: { backgroundColor: colors.error.color },
        text: 'white.color',
      };
  }
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radii.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    zIndex: 1000,
  },
  text: { textAlign: 'center' },
});

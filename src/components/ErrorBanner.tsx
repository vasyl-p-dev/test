import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { Typography } from './Typography';

export interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner: FC<ErrorBannerProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <Typography variant="bodySmall" color="error.color" style={styles.msg}>
        {message}
      </Typography>
      {onRetry && (
        <Pressable onPress={onRetry} hitSlop={10} accessibilityRole="button">
          <Typography variant="captionBig" color="tertiary.color">
            Retry
          </Typography>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.error.light,
    borderRadius: radii.input,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginBottom: spacing.base,
    gap: spacing.md,
  },
  msg: { flex: 1 },
});

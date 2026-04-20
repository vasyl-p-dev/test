import { FC } from 'react';
import { Image, ImageStyle, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

const CHEVRON = require('../../assets/chevron.png');

type BackButtonVariant = 'default' | 'disabled';

export interface BackButtonProps {
  onPress: () => void;
  variant?: BackButtonVariant;
}

export const BackButton: FC<BackButtonProps> = ({ onPress, variant = 'default' }) => {
  const iconStyle = getStyles(variant);
  const isDisabled = variant === 'disabled';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={16}
      accessibilityRole="button"
      accessibilityLabel="Back"
      accessibilityState={{ disabled: isDisabled }}
      style={styles.tap}
    >
      <Image source={CHEVRON} style={[styles.glyph, iconStyle]} resizeMode="contain" />
    </Pressable>
  );
};

function getStyles(variant: BackButtonVariant): ImageStyle {
  switch (variant) {
    case 'default':
      return { tintColor: colors.grey.extraDark };
    case 'disabled':
      return { tintColor: colors.grey.light, opacity: 0.5 };
  }
}

// 32×32 tap area so we keep the Figma hit-target, but nothing is drawn outside
// the chevron itself — avoids stacking a white chip on top of iOS's native bar-item
// hosting view, which otherwise reads as a "wrapper around the button".
const TAP_AREA = 32;
const GLYPH_WIDTH = 9;
const GLYPH_HEIGHT = 14;

const styles = StyleSheet.create({
  tap: {
    width: TAP_AREA,
    height: TAP_AREA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { width: GLYPH_WIDTH, height: GLYPH_HEIGHT },
});

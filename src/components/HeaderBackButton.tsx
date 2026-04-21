import { FC } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';

const CHEVRON = require('../../assets/chevron.png');

export interface HeaderBackButtonProps {
  onPress: () => void;
}

export const HeaderBackButton: FC<HeaderBackButtonProps> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={16}
    accessibilityRole="button"
    accessibilityLabel="Back"
    style={styles.tap}
  >
    <Image source={CHEVRON} style={styles.glyph} resizeMode="contain" />
  </Pressable>
);

const styles = StyleSheet.create({
  tap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  glyph: { width: 9, height: 14, tintColor: colors.grey.extraDark },
});
